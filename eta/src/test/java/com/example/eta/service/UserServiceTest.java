package com.example.eta.service;

import com.example.eta.auth.enums.RoleType;
import com.example.eta.dto.UserDto;
import com.example.eta.entity.User;
import com.example.eta.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class UserServiceTest {

    @Autowired
    UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SignupInfoService signupInfoService;
    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @Transactional
    @DisplayName("비밀번호 초기화 테스트")
    public void testResetPassword() throws Exception{
        User user = userRepository.save(User.builder()
                .email("suprlux09@ajou.ac.kr")
                .isVerified(false)
                .password("password!")
                .name("James")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        String tmpPassword = signupInfoService.generateSignupToken();
        userService.resetPassword(user.getEmail(), tmpPassword);

        UserDto.LoginDto loginDto = new UserDto.LoginDto("suprlux09@ajou.ac.kr", tmpPassword, "expoPushToken");
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(loginDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(header().exists("Authorization"));
    }
}
