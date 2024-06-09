package com.example.eta.controller;

import com.example.eta.api.ApiClientSocial;
import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.enums.SocialType;
import com.example.eta.auth.jwt.JwtTokenProvider;
import com.example.eta.dto.UserDto;
import com.example.eta.entity.SignupInfo;
import com.example.eta.entity.User;
import com.example.eta.enums.RoleType;
import com.example.eta.exception.signup.EmailAlreadyExistsException;
import com.example.eta.service.MailService;
import com.example.eta.service.SignupInfoService;
import com.example.eta.service.TokenService;
import com.example.eta.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${spring.jwt.header}")
    private String header;
    @Value("${spring.jwt.prefix}")
    private String prefix;

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final TokenService tokenService;
    private final SignupInfoService signupInfoService;
    private final MailService mailService;
    private final ApiClientSocial apiClientSocial;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<Object> authorize(@RequestBody UserDto.LoginDto loginDto) {

        // TODO: 예외 처리(소셜 계정, 비밀번호 제한)
        User user = userService.findByEmail(loginDto.getEmail());

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(UserPrincipal.create(user), loginDto.getPassword());

        // 인증
        authenticationManager.authenticate(authenticationToken);

        // JWT 토큰 발급
        String jwt = jwtTokenProvider.generateJwtToken(user);

        // expo 토큰 저장
        tokenService.saveToken(user, loginDto.getExpoPushToken());

        // 로그인 시간 갱신
        userService.updateLastLoginDate(user);

        // 응답
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(header, prefix + jwt);
        HashMap<String, Object> response = new HashMap<>() {{
            put("token", jwt);
            put("user_id", user.getUserId());
            put("name", user.getName());
        }};

        return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<Void> sendVerificationCode(@RequestBody Map<String, String> request) throws Exception {
        String email = request.get("email");
        String code = signupInfoService.generateCode();
        signupInfoService.addUnverifiedEmailInfo(email, code);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmailByCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String signupToken = signupInfoService.verifyCodeAndIssueSignupToken(email, code);
        return ResponseEntity.ok(Map.of("signupToken", signupToken));
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@RequestBody @Valid UserDto.InfoDto InfoDto) throws RuntimeException {
        if (userService.isExistEmail(InfoDto.getEmail())) throw new EmailAlreadyExistsException();

        SignupInfo signupInfo = signupInfoService.verifySignupToken(InfoDto.getEmail(), InfoDto.getSignupToken());

        User user = new User();
        user.setName(InfoDto.getName());
        user.setPassword(passwordEncoder.encode(InfoDto.getPassword()));
        user.setEmail(InfoDto.getEmail());
        user.setRoleType(RoleType.ROLE_USER);
        user.setCreatedDate(LocalDateTime.now());
        user.setEnabled(true);

        HashMap<String, Object> response = new HashMap<>() {{
            put("user_id", userService.join(user));
        }};

        signupInfoService.deleteSignupInfo(signupInfo);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/social-login/kakao")
    public ResponseEntity<?> socialLoginKakao(@RequestBody Map<String, String> requestBody) {
        String accessToken = requestBody.get("accessToken");
        try {
            Map<String, Object> kakaoUserDetails = apiClientSocial.getKakaoUserDetails(accessToken).block().getBody();
            String kakaoId = kakaoUserDetails.get("id").toString();
            String kakaoName = ((Map<String, Object>)kakaoUserDetails.get("properties")).get("nickname").toString();

            User user;
            // 존재하지 않은 회원일 시 생성
            if (!userService.isExistEmail(kakaoId)) {
                user = User.builder()
                        .email(kakaoId)
                        .name(kakaoName)
                        .socialType(SocialType.KAKAO)
                        .roleType(RoleType.ROLE_USER)
                        .createdDate(LocalDateTime.now())
                        .enabled(true)
                        .build();
                userService.join(user);
            }
            else {
                user = userService.findByEmail(kakaoId);
            }

            // JWT 토큰 발급
            String jwt = jwtTokenProvider.generateJwtToken(user);

            // expo 토큰 저장
            tokenService.saveToken(userService.findByEmail(kakaoId), requestBody.get("expoPushToken"));

            // 로그인 시간 갱신
            userService.updateLastLoginDate(user);

            // 응답
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add(header, prefix + jwt);
            HashMap<String, Object> response = new HashMap<>() {{
                put("token", jwt);
                put("user_id", user.getUserId());
                put("name", user.getName());
            }};

            return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);
        }
        catch (WebClientResponseException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        tokenService.deleteToken(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> requestBody) throws Exception {
        String email = requestBody.get("email");
        String tmpPassword = signupInfoService.generateSignupToken();
        userService.resetPassword(email, tmpPassword);
        return ResponseEntity.ok().build();
    }
}