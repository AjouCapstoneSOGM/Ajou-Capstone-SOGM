package com.example.eta.controller;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.dto.UserDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.User;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Assertions;
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

import java.time.LocalDateTime;
import java.util.List;

import static com.example.eta.controller.utils.controllerTestUtils.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class PortfolioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("포트폴리오 인가 테스트")
    @Transactional
    public void testPortfolioAuthorization() throws Exception {
        // 회원가입, 로그인 후 토큰 반환
        String authorizationHeader = signUpLogin(mockMvc);

        // 다른 유저로 포트폴리오 생성
        User user = userRepository.save(new User().builder()
                .email("james001@foo.bar")
                .isVerified(false)
                .password("password!")
                .name("James")
                .role("USER")
                .createdDate(LocalDateTime.now())
                .enabled(true).build());
        int pfId = portfolioRepository.save(Portfolio.builder()
                .user(user)
                .createdDate(LocalDateTime.now())
                .country("KOR")
                .isAuto(true)
                .initAsset(4000000)
                .initCash(1000000)
                .currentCash(1000000)
                .riskValue(1)
                .build()).getPfId();

        mockMvc.perform(get("/api/portfolio/"+pfId+"/performance")
                        .header("Authorization", authorizationHeader))
                .andDo(print())
                .andExpect(status().isForbidden());
    }
}
