package world.moducare.global.config.oauth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import world.moducare.domain.member.entity.Member;
import world.moducare.domain.member.repository.MemberRepository;
import world.moducare.domain.member.service.MemberService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class OAuth2UserCustomService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    @Override
    public CustomOAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        CustomOAuth2User oAuth2User = null;

        switch (registrationId) {
            case "naver":
                oAuth2User = loadNaverUser(userRequest);
                break;
            case "kakao":
                oAuth2User = loadKakaoUser(userRequest);
                break;
            case "google":
                oAuth2User = loadGoogleUser(userRequest);
                break;
        }



//        String email = (String) oAuth2User.getAttributes().get("email");
//        Member member = saveOrUpdate(email, (String) oAuth2User.getAttributes().get("name"));
//
//        return new CustomOAuth2User(member);  // CustomOAuth2User로 반환
        return oAuth2User;
    }

    private CustomOAuth2User loadGoogleUser(OAuth2UserRequest userRequest) {
        // 기본 OAuth2UserService를 사용하여 사용자 정보를 가져옵니다.
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 구글의 경우, 사용자 정보는 기본적으로 "email"과 "name"을 포함합니다.
        String email = (String) oAuth2User.getAttributes().get("email");
        String name = (String) oAuth2User.getAttributes().get("name");

        // 사용자 정보 저장 또는 업데이트
        Member member = saveOrUpdate(email, name);

        // CustomOAuth2User 객체 생성 후 반환
        return new CustomOAuth2User(member);
    }

    private CustomOAuth2User loadNaverUser(OAuth2UserRequest userRequest) {
        String accessToken = userRequest.getAccessToken().getTokenValue();
        String userInfoEndpointUri = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(userInfoEndpointUri, HttpMethod.GET, entity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null || !responseBody.containsKey("response")) {
            throw new OAuth2AuthenticationException("Failed to retrieve user information from Naver.");
        }

        Map<String, Object> attributes = (Map<String, Object>) responseBody.get("response");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Member member = saveOrUpdate(email, name);

        return new CustomOAuth2User(member);
    }

    private CustomOAuth2User loadKakaoUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> additionalInfo = getAdditionalInfo(userRequest, oAuth2User);
        String email = (String) additionalInfo.get("email");
        String name = (String) additionalInfo.getOrDefault("profile_nickname", "");

        Member member = saveOrUpdate(email, name);

        return new CustomOAuth2User(member);
    }

    private Map<String, Object> getAdditionalInfo(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String accessToken = userRequest.getAccessToken().getTokenValue();
        Map<String, Object> result = new HashMap<>();

        if ("kakao".equals(registrationId)) {
            String url = "https://kapi.kakao.com/v2/user/me";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            Map<String, Object> kakaoAccount = (Map<String, Object>) response.getBody().get("kakao_account");
            if (kakaoAccount != null) {
                result.put("email", kakaoAccount.get("email"));
                result.put("name", kakaoAccount.get("name"));
            }
        }

        return result;
    }

    private Member saveOrUpdate(String email, String name) {
        String finalName;
        if (name.equals("")||name==null) {
            finalName = "자라나라머리머리";
        } else {
            finalName = name;
        }

        Member member = memberRepository.findByEmail(email)
                .map(entity -> entity.updateName(finalName))
                .orElseGet(() -> Member.builder()
                        .email(email)
                        .name(finalName)
                        .build());

        memberRepository.save(member);
        return member;
    }
}