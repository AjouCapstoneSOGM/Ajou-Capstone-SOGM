package com.example.eta.controller.utils;

import com.example.eta.dto.UserDto;
import com.example.eta.service.SignupInfoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ControllerTestUtils {

    public static String signUpLogin(MockMvc mockMvc) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        UserDto.InfoDto InfoDto = new UserDto.InfoDto("James", "james@domain.com", "password!");
        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(InfoDto)));

        UserDto.LoginDto loginDto = new UserDto.LoginDto("james@domain.com", "password!", "fcmToken");
        MockHttpServletResponse loginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(header().exists("Authorization"))
                .andReturn().getResponse();

        return loginResponse.getHeader("Authorization");
    }

    public static Map<String, String> getRequestBodyForCodeValidation(SignupInfoService signupInfoService) {
        String email = "test@asdf.com";
        String code = signupInfoService.generateCode();

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("code", code);
        return requestBody;
    }
}
