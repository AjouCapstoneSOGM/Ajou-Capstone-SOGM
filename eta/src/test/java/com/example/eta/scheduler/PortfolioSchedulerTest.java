package com.example.eta.scheduler;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.*;
import com.example.eta.repository.*;
import com.example.eta.service.PortfolioService;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class PortfolioSchedulerTest {

    @Autowired
    private PortfolioScheduler portfolioScheduler;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private PortfolioSectorRepository portfolioSectorRepository;

    @Autowired
    private PortfolioTickerRepository portfolioTickerRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private TickerRepository tickerRepository;

    @Test
    @Transactional
    public void testUpdateProportion() {
        // given 유저, 자동 포트폴리오 생성
        User user = userRepository.save(User.builder()
                .email("james001@foo.bar")
                .isVerified(false)
                .password("password!")
                .name("James")
                .role("USER")
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        Portfolio portfolio = portfolioRepository.save(Portfolio.builder()
                .user(user)
                .createdDate(LocalDateTime.now())
                .country("KOR")
                .isAuto(true)
                .initAsset(1000000)
                .currentCash(1000000)
                .riskValue(1)
                .build());

        // given 포트폴리오에 IT 섹터 관심분야로 추가, 종목 추가(삼전 주식 10개를 0원에 구매했다고 가정)
        PortfolioSector portfolioSector = portfolioSectorRepository.save(PortfolioSector.builder()
                .portfolio(portfolio)
                .sector(sectorRepository
                .findById("G45").get())
                .build());
        portfolio.getPortfolioSectors().add(portfolioSector);

        PortfolioTicker portfolioTicker = portfolioTickerRepository.save(PortfolioTicker.builder()
                .portfolio(portfolio)
                .ticker(tickerRepository.findById("005930").get())
                .initProportion(0.0f)
                .currentProportion(0.0f)
                .number(10)
                .averagePrice(0.0f)
                .build());
        portfolio.getPortfolioTickers().add(portfolioTicker);

        // when 삼전 종가 가격에 맞춰서 비중 업데이트
        portfolioScheduler.updateProportion(portfolio);

        // then
        System.out.println(portfolioTicker.getCurrentProportion());
        Assertions.assertAll(
            () -> assertNotEquals(0.0f, portfolioTicker.getCurrentProportion())
        );
    }
}
