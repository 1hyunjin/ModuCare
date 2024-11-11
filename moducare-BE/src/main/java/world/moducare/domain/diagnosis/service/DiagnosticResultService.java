package world.moducare.domain.diagnosis.service;

import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import world.moducare.domain.api.gpt.GptService;
import world.moducare.domain.api.gpt.PromptService;
import world.moducare.domain.diagnosis.dto.AiResultDto;
import world.moducare.domain.diagnosis.dto.DiagnosisRequestDto;
import world.moducare.domain.diagnosis.dto.DiagnosisResponseDto;
import world.moducare.domain.diagnosis.entity.DiagnosticResult;
import world.moducare.domain.diagnosis.repository.DiagnosticResultRepository;
import world.moducare.domain.member.entity.Member;
import world.moducare.global.exception.ErrorCode;
import world.moducare.global.exception.RestApiException;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RequiredArgsConstructor
@Service
public class DiagnosticResultService {
    private final DiagnosticResultRepository diagnosticResultRepository;
    private final GptService gptService;
    private final PromptService promptService;

    public List<DiagnosisResponseDto> getDiagnosticList(Member member) {
        List<DiagnosticResult> results = diagnosticResultRepository.findAllByMemberOrderByCreatedAtDesc(member).orElse(null);
        if (results == null) {
            return new ArrayList<>();
        }

        List<DiagnosisResponseDto> diagnosisResponseDtoList = new ArrayList<>();
        for (DiagnosticResult result : results) {
            DiagnosisResponseDto diagnosisResponseDto = DiagnosisResponseDto.builder()
                    .id(result.getId())
                    .date(formatToCustomString(result.getCreatedAt()))
                    .diagnosis(result.getResult())
                    .build();

            diagnosisResponseDtoList.add(diagnosisResponseDto);
        }

        return diagnosisResponseDtoList;
    }

    public DiagnosisRequestDto getDiagnosis(Long diagnosisId, Member member) {
        DiagnosticResult diagnosticResult = diagnosticResultRepository.findByMemberAndId(member, diagnosisId).orElseThrow(()->new RestApiException(ErrorCode.NOT_FOUND));
        int[] result = new int[6];
        result[0] = diagnosticResult.getHairLoss();
        result[1] = diagnosticResult.getDandruff();
        result[2] = diagnosticResult.getInflammatory();
        result[3] = diagnosticResult.getErythema();
        result[4] = diagnosticResult.getSebum();
        result[5] = diagnosticResult.getDeadSkin();

        return DiagnosisRequestDto.builder()
                .img(diagnosticResult.getImage())
                .result(result)
                .headType(AiResultDto.headTypeToInt(diagnosticResult.getResult()))
                .comparison(diagnosticResult.getComparison())
                .manageComment(diagnosticResult.getAdvice())
                .date(formatToCustomString(diagnosticResult.getCreatedAt()))
                .build();
    }

    public DiagnosisRequestDto diagnoseByAI(Member member, AiResultDto aiResultDto, String url) {
        int average = diagnosticResultRepository.findLatestAverageByMember(member).orElse(-1);
        int comparison;
        if (average == -1)
            comparison = 3;
        else {
            int difference = (int) Math.round(aiResultDto.calculateAverage() - average);
            switch (difference) {
                case 0:
                    comparison = 2; // 이전 결과 유지
                    break;
                case 1, 2, 3, 4, 5: // 차이가 양수인 경우 (이전보다 좋지 않음)
                    comparison = 0;
                    break;
                default: // 음수인 경우 (이전보다 좋음)
                    comparison = 1;
                    break;
            }
        }

        String prompt = promptService.makeDiagnosisPrompt(aiResultDto, comparison);
        String advice = gptService.chat(prompt);

        DiagnosticResult diagnosticResult = DiagnosticResult.builder()
                .image(url)
                .advice(advice)
                .hairLoss(aiResultDto.getResult()[0])
                .dandruff(aiResultDto.getResult()[1])
                .inflammatory(aiResultDto.getResult()[2])
                .erythema(aiResultDto.getResult()[3])
                .sebum(aiResultDto.getResult()[4])
                .deadSkin(aiResultDto.getResult()[5])
                .comparison(comparison)
                .average(average)
                .result(aiResultDto.headTypeToString())
                .member(member)
                .build();

        diagnosticResultRepository.save(diagnosticResult);

        // TODO: 시간형식 확인하기
        return DiagnosisRequestDto.builder()
                .img(url)
                .result(aiResultDto.getResult())
                .headType(aiResultDto.getHeadType())
                .comparison(comparison)
                .manageComment(advice)
                .date(formatToCustomString(diagnosticResult.getCreatedAt()))
                .build();
    }

    // YYYY-MM-DD 오전/오후 HH:MM:SS 형식으로 변환
    public static String formatToCustomString(ZonedDateTime zonedDateTime) {
        // ZonedDateTime을 한국 시간대로 변환
        ZonedDateTime seoulTime = zonedDateTime.withZoneSameInstant(ZoneId.of("Asia/Seoul"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd a hh:mm:ss", Locale.KOREAN);
        return seoulTime.format(formatter);
    }
}
