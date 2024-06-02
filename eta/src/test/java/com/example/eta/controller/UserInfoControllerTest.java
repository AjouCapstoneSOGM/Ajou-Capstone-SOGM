package com.example.eta.controller;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.User;
import com.example.eta.repository.*;
import com.example.eta.service.PortfolioService;
import com.example.eta.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.eta.controller.utils.ControllerTestUtils.signUpLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class UserInfoControllerTest {

    @Autowired
    private UserService userService;

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private RebalancingRepository rebalancingRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private SignupInfoRepository signupInfoRepository;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("회원 탈퇴")
    @Transactional
    public void testDeleteUserInfo() throws Exception {
        // 회원정보, 회원이 생성한 포트폴리오, 리밸런싱 모두 삭제되는지 확인
        String email = "suprlux09@ajou.ac.kr";
        String authorizationHeader = signUpLogin(email, mockMvc, signupInfoRepository);
        User user = userService.findByEmail(email);

        String sector = "G25";
        PortfolioDto.CreateRequestDto createRequestDto = PortfolioDto.CreateRequestDto.builder()
                .country("KOR")
                .sector(List.of(sector))
                .asset(10000000)
                .riskValue(1).build();
        int pfId = portfolioService.createInitAutoPortfolio(user, createRequestDto).getPfId();

        portfolioService.initializeAutoPortfolio(portfolioRepository.getReferenceById(pfId), createRequestDto);
        int rnId = rebalancingRepository.findAllByPortfolio(portfolioRepository.getReferenceById(pfId)).get(0).getRnId();
        int userId = user.getUserId();

        mockMvc.perform(delete("/api/info")
                .header("Authorization", authorizationHeader))
                .andDo(print()).andExpect(status().isOk());

        assertFalse(userRepository.existsByEmail(email));
        assertFalse(tokenRepository.existsById(userId));
        assertFalse(rebalancingRepository.existsById(rnId));
        assertFalse(portfolioRepository.existsById(pfId));
    }
}
