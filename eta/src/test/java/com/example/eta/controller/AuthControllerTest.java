package com.example.eta.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.eta.dto.UserDto;
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
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class AuthControllerTest {

    @Autowired
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("정상적인 회원가입 테스트")
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
    @DisplayName("로그인, jwt 발급")
    @Transactional
    public void testLogin() throws Exception {
        // given
        ObjectMapper objectMapper = new ObjectMapper();
        UserDto.InfoDto InfoDto = new UserDto.InfoDto("James", "james@domain.com", "password!");
        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(InfoDto)));

        UserDto.LoginDto loginDto = new UserDto.LoginDto("james@domain.com", "password!");

        // when, then
        MockHttpServletResponse response = mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(loginDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(header().exists("Authorization"))
                .andReturn().getResponse();
    }
}
