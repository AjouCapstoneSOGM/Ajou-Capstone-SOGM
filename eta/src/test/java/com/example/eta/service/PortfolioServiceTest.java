package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.User;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension.class)
public class PortfolioServiceTest {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("자동 포트폴리오 생성")
    public void testCreateInitAutoPortfolio() throws Exception {
        // given 유저 생성
        User user = userRepository.save(new User().builder()
                .email("james001")
                .isVerified(false)
                .password("password!")
                .name("James")
                .role("User")
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        // when 포트폴리오 생성
        PortfolioDto.CreateRequestDto createRequestDto = PortfolioDto.CreateRequestDto.builder()
                .country("KOR")
                .sector(List.of("G25"))
                .asset(10000000)
                .riskValue(1).build();
        int pfId = portfolioService.createInitAutoPortfolio(createRequestDto).getPfId();

        // then DB에서 가져오기, 유저id 정보가 맞는지, createdDate가 null인지
        Portfolio portfolio = portfolioRepository.findById(pfId).get();
        Assertions.assertAll(
                () -> assertEquals(portfolio.getUser(), user),
                () -> assertNull(portfolio.getCreatedDate())
        );
    }

    @Test
    @DisplayName("생성된 자동 포트폴리오에 리밸런싱 알림 반영")
    public void testApplyResultInitAutoPortfolio() throws Exception {

    }
}
