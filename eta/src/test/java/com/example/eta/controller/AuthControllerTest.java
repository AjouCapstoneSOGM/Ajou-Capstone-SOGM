package com.example.eta.controller;

import static com.example.eta.controller.utils.ControllerTestUtils.getRequestBodyForCodeValidation;
import static com.example.eta.controller.utils.ControllerTestUtils.signUpLogin;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.eta.auth.enums.RoleType;
import com.example.eta.dto.UserDto;
import com.example.eta.entity.SignupInfo;
import com.example.eta.entity.User;
import com.example.eta.exception.signup.CodeExpiredException;
import com.example.eta.exception.signup.CodeVerificationFailedException;
import com.example.eta.exception.signup.MissingSignupAttemptException;
import com.example.eta.repository.SignupInfoRepository;
import com.example.eta.repository.TokenRepository;
import com.example.eta.service.SignupInfoService;
import com.example.eta.service.TokenService;
import com.example.eta.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class AuthControllerTest {

    @Autowired
    private UserService userService;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private SignupInfoService signupInfoService;
    @Autowired
    private SignupInfoRepository signupInfoRepository;
    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("인증번호 입력 API(정상적인 경우)")
    @Transactional
    public void testVerifyEmailByCode() throws Exception {
        Map<String, String> requestBody = getRequestBodyForCodeValidation(signupInfoService);
        signupInfoService.addUnverifiedEmailInfo(requestBody.get("email"), requestBody.get("code"));

        MockHttpServletResponse response = mockMvc.perform(post("/api/auth/verify-email")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn().getResponse();

        SignupInfo signupInfo = signupInfoRepository.findById(requestBody.get("email")).get();
        assertEquals(signupInfo.getSignupToken(), JsonPath.parse(response.getContentAsString()).read("$.signupToken"));
    }

    @Test
    @DisplayName("인증번호 입력 API(회원가입 미시도)")
    @Transactional
    public void testVerifyEmailByCodeMissingSignupAttempt() throws Exception {
        Map<String, String> requestBody = getRequestBodyForCodeValidation(signupInfoService);

        ResultActions resultActions = mockMvc.perform(post("/api/auth/verify-email")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(requestBody)))
                    .andDo(print())
                    .andExpect(status().isNotFound());

        resultActions.andExpect(result -> {
            assertTrue(result.getResolvedException() instanceof MissingSignupAttemptException);
        });
    }

    @Test
    @DisplayName("인증번호 입력 API(잘못된 코드)")
    @Transactional
    public void testVerifyEmailByCodeVerificationFailed() throws Exception {
        Map<String, String> requestBody = getRequestBodyForCodeValidation(signupInfoService);
        signupInfoService.addUnverifiedEmailInfo(requestBody.get("email"), "000000");

        requestBody.put("code", "111111");

        ResultActions resultActions = mockMvc.perform(post("/api/auth/verify-email")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isForbidden());

        resultActions.andExpect(result -> {
            assertTrue(result.getResolvedException() instanceof CodeVerificationFailedException);
        });
    }

    @Test
    @DisplayName("인증번호 입력 API(만료된 코드)")
    @Transactional
    public void testVerifyEmailByCodeExpired() throws Exception {
        Map<String, String> requestBody = getRequestBodyForCodeValidation(signupInfoService);
        signupInfoService.addUnverifiedEmailInfo(requestBody.get("email"), requestBody.get("code"));

        SignupInfo signupInfo = signupInfoRepository.findById(requestBody.get("email")).get();
        signupInfo.setCodeExpires(signupInfo.getCodeExpires().minusMinutes(10));

        ResultActions resultActions = mockMvc.perform(post("/api/auth/verify-email")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isUnauthorized());

        resultActions.andExpect(result -> {
            assertTrue(result.getResolvedException() instanceof CodeExpiredException);
        });
    }

    @Test
    @DisplayName("회원가입 API(정상적인 경우)")
    @Transactional
    public void testSignUp() throws Exception {
        signupInfoRepository.save(SignupInfo.builder()
                .email("suprlux09@ajou.ac.kr")
                .code("000000")
                .isVerified(true)
                .codeExpires(LocalDateTime.now().plusMinutes(5))
                .signupToken("abcdefgh12345678")
                .build());

        UserDto.InfoDto InfoDto = new UserDto.InfoDto("James", "suprlux09@ajou.ac.kr", "abcdefgh12345678", "password!");
        MockHttpServletResponse response = mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(InfoDto)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andReturn().getResponse();

        Integer id = JsonPath.parse(response.getContentAsString()).read("$.user_id");
        assertNotNull(userService.findOne(id));
    }

    @Test
    @DisplayName("로그인, jwt 발급 API(정상적인 경우)")
    @Transactional
    public void testLogin() throws Exception {
        signupInfoRepository.save(SignupInfo.builder()
                .email("suprlux09@ajou.ac.kr")
                .code("000000")
                .isVerified(true)
                .codeExpires(LocalDateTime.now().plusMinutes(5))
                .signupToken("abcdefgh12345678")
                .build());

        UserDto.InfoDto InfoDto = new UserDto.InfoDto("James", "suprlux09@ajou.ac.kr", "abcdefgh12345678", "password!");
        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(InfoDto)))
                .andDo(print());

        UserDto.LoginDto loginDto = new UserDto.LoginDto("suprlux09@ajou.ac.kr", "password!", "expoPushToken");
        MockHttpServletResponse response = mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(loginDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(header().exists("Authorization"))
                .andReturn().getResponse();

        assertTrue(JsonPath.parse(response.getContentAsString()).read("$.name").equals("James"));
        tokenRepository.findById(userService.findByEmail("suprlux09@ajou.ac.kr").getUserId())
                .ifPresent(token -> assertNotNull(token.getExpoPushToken()));
    }

    @Test
    @DisplayName("로그아웃 테스트")
    @Transactional
    public void testLogout() throws Exception {
        // 회원가입, 로그인 후 토큰 반환
        String authorizationHeader = signUpLogin("suprlux09@ajou.ac.kr", mockMvc, signupInfoRepository);
        User user = userService.findByEmail("suprlux09@ajou.ac.kr");
        assertTrue(tokenRepository.existsById(user.getUserId()));

        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", authorizationHeader))
                .andDo(print()).andExpect(status().isOk());

        assertFalse(tokenRepository.existsById(user.getUserId()));
    }
}
