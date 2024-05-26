package com.example.eta.controller;

import static com.example.eta.controller.utils.ControllerTestUtils.getRequestBodyForCodeValidation;
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

    @Test
    @DisplayName("인증번호 입력 API(정상적인 경우)")
    @Transactional
    public void testVerifyEmailByCode() throws Exception {
        Map<String, String> requestBody = getRequestBodyForCodeValidation(signupInfoService);
        signupInfoService.addUnverifiedEmailInfo(requestBody.get("email"), requestBody.get("code"));
        ObjectMapper objectMapper = new ObjectMapper();

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
        ObjectMapper objectMapper = new ObjectMapper();

        ResultActions resultActions = mockMvc.perform(post("/api/auth/verify-email")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(requestBody)))
                    .andDo(print());

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
        ObjectMapper objectMapper = new ObjectMapper();

        ResultActions resultActions = mockMvc.perform(post("/api/auth/verify-email")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print());

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
        ObjectMapper objectMapper = new ObjectMapper();

        ResultActions resultActions = mockMvc.perform(post("/api/auth/verify-email")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print());

        resultActions.andExpect(result -> {
            assertTrue(result.getResolvedException() instanceof CodeExpiredException);
        });
    }


    // TODO: 회원가입 코드 재작성
    // 메일 보내는 부분을 제외하고, 나머지 부분(코드 검증 후 회원가입)을 API로 구현
    @Test
    @DisplayName("회원가입 API(정상적인 경우)")
    @Transactional
    public void testSignUp() throws Exception {
        // given
        UserDto.InfoDto InfoDto = new UserDto.InfoDto("James", "james@domain.com", "password!");
        ObjectMapper objectMapper = new ObjectMapper();

        // when, then
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
        // given
        ObjectMapper objectMapper = new ObjectMapper();
        userService.join(User.builder()
                .email("james@domain.com")
                .password("password!")
                .name("James")
                .createdDate(LocalDateTime.now())
                .roleType(RoleType.ROLE_USER)
                .enabled(true)
                .build());

        UserDto.LoginDto loginDto = new UserDto.LoginDto("james@domain.com", "password!", "expoPushToken");

        // when, then
        MockHttpServletResponse response = mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(loginDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(header().exists("Authorization"))
                .andReturn().getResponse();

        assertTrue(JsonPath.parse(response.getContentAsString()).read("$.name").equals("James"));
        tokenRepository.findById(userService.findByEmail("james@domain.com").getUserId())
                .ifPresent(token -> assertNotNull(token.getExpoPushToken()));
    }
}
