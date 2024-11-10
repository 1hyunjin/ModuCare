package world.moducare.domain.challengefeed.service;

import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import world.moducare.domain.challenge.entity.Challenge;
import world.moducare.domain.challenge.repository.ChallengeRepository;
import world.moducare.domain.challengefeed.dto.FeedResponseDto;
import world.moducare.domain.challengefeed.entity.ChallengeFeed;
import world.moducare.domain.challengefeed.repository.ChallengeFeedRepository;
import world.moducare.domain.favorite.repository.FavoriteRepository;
import world.moducare.domain.member.entity.Member;
import world.moducare.global.exception.ErrorCode;
import world.moducare.global.exception.RestApiException;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ChallengeFeedService {

    private final ChallengeFeedRepository challengeFeedRepository;
    private final ChallengeRepository challengeRepository;
    private final FavoriteRepository favoriteRepository;

    public void saveFeed(Member member, Long challengeId, String content, String fileUrl) {

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // 오늘 날짜에 동일한 member와 challenge가 존재하는지 확인
        boolean exists = challengeFeedRepository.existsByChallengeAndMemberAndToday(member.getId(), challengeId, LocalDate.now());

        // 중복된 경우 예외 발생
        if(exists){
            throw new RestApiException(ErrorCode.CONFLICT);
        }

        // 중복이 아니라면 ChallengeFeed 생성 및 저장
        ChallengeFeed challengeFeed = ChallengeFeed.builder()
                .image(fileUrl)
                .content(content)
                .member(member)
                .challenge(challenge)
                .build();

        challengeFeedRepository.save(challengeFeed);
    }

    public List<FeedResponseDto> getFeed(Member member, Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        List<ChallengeFeed> challengeFeed = challengeFeedRepository.findAllByChallengeOrderByCreatedAtDesc(challenge).orElseThrow(()->new RestApiException(ErrorCode.NOT_FOUND));

        List<FeedResponseDto> list = new ArrayList<>();
        for(ChallengeFeed feed : challengeFeed){
            int likeCnt = favoriteRepository.countByFeed(feed);
            boolean exists = favoriteRepository.existsByFeedAndMember(feed, member);

            FeedResponseDto responseDto = FeedResponseDto.builder()
                    .feedId(feed.getId())
                    .feedImg(feed.getImage())
                    .feedUserName(feed.getMember().getName())
                    .content(feed.getContent())
                    .feedRegDate(formatToCustomString(feed.getCreatedAt()))
                    .like(likeCnt)
                    .isLiked(exists?1:0)
                    .build();

            list.add(responseDto);
        }
        return list;
    }

    // YYYY-MM-DD 오전/오후 HH:MM:SS 형식으로 변환
    public static String formatToCustomString(ZonedDateTime zonedDateTime) {
        // ZonedDateTime을 한국 시간대로 변환
        ZonedDateTime seoulTime = zonedDateTime.withZoneSameInstant(ZoneId.of("Asia/Seoul"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd a hh:mm:ss", Locale.KOREAN);
        return seoulTime.format(formatter);
    }

}
