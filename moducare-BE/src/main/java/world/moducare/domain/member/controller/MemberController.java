package world.moducare.domain.member.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import world.moducare.domain.member.dto.ModifyRequest;
import world.moducare.domain.member.dto.SocialLoginRequest;
import world.moducare.domain.member.dto.SocialLoginResponse;
import world.moducare.domain.member.entity.Member;
import world.moducare.domain.member.service.MemberService;
import world.moducare.global.config.jwt.TokenProvider;
import world.moducare.global.config.oauth.CustomOAuth2User;
import world.moducare.global.config.oauth.OAuth2UserCustomService;

import java.time.Duration;

@RequiredArgsConstructor
@RestController
@RequestMapping("/members")
@Tag(name = "회원 관리 컨트롤러", description = "사용자 관련 API")
public class MemberController {
    private final MemberService memberService;
    private final TokenProvider tokenProvider;
    private final OAuth2UserCustomService oAuth2UserCustomService;
//    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofHours(2);
//    public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14);
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(14);
    public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(21);

    @PostMapping("/login/{registerId}")
    @Operation(summary = "소셜 로그인", description = "프론트엔드로부터 소셜 액세스 토큰을 받아 사용자 인증을 처리합니다.")
    public ResponseEntity<SocialLoginResponse> socialLogin(@RequestBody SocialLoginRequest socialLoginRequest,
                                                           @PathVariable String registerId) {
        String accessToken = socialLoginRequest.getAccessToken();
        CustomOAuth2User oAuth2User = oAuth2UserCustomService.loadUser(accessToken, registerId);

        // JWT 액세스 및 리프레시 토큰 생성
        String jwtToken = tokenProvider.generateMemberToken(oAuth2User.getMember(), ACCESS_TOKEN_DURATION);
        String refreshToken = tokenProvider.generateMemberToken(oAuth2User.getMember(), REFRESH_TOKEN_DURATION);

        memberService.saveMemberAndToken(oAuth2User.getMember(), socialLoginRequest.getFcmToken(), refreshToken);

        // 응답 생성
        SocialLoginResponse response = memberService.getSocialMember(oAuth2User.getMember(), jwtToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "로그아웃입니다.")
    public ResponseEntity<String> logout(@AuthenticationPrincipal CustomOAuth2User principal) {
        memberService.logout(principal.getMember());
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }

    // 회원 탈퇴
    @DeleteMapping("/")
    @Operation(summary = "회원탈퇴", description = "회원탈퇴입니다.")
    public ResponseEntity<String> deleteAccount(@AuthenticationPrincipal CustomOAuth2User principal) {
        Long id = principal.getId(); // 현재 인증된 사용자의 ID 가져오기
        Member member = memberService.findById(id);

        // 회원 탈퇴 로직 수행 (회원 삭제 등)
        memberService.deleteMember(member);

        // SecurityContext 초기화 등 로그아웃 처리
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Account deletion successful");
    }

    @PutMapping("/modify")
    @Operation(summary = "회원정보 수정", description = "회원 정보(이름, 생일)을 수정합니다.")
    public ResponseEntity<String> modifyAccount(@AuthenticationPrincipal CustomOAuth2User principal, ModifyRequest modifyRequest) {
        Long id = principal.getId(); // 현재 인증된 사용자의 ID 가져오기
        Member member = memberService.findById(id);

        // 회원 탈퇴 로직 수행 (회원 삭제 등)
        memberService.modifyMember(member, modifyRequest);
        return ResponseEntity.ok("Account modification successful");
    }

}
