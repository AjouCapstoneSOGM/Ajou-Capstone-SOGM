package com.example.eta.scheduler;

import com.example.eta.entity.*;
import com.example.eta.enums.RoleType;
import com.example.eta.repository.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

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

    @Autowired
    private RebalancingRepository rebalancingRepository;

    @Autowired
    private PriceRepository priceRepository;

    private User user;
    private Portfolio portfolio;

    /**
     * 유저의 초기 포트폴리오 상태
     * 현금 1백만원(33%)
     * 신라섬유 1백만원(33%) 평단가 50만원*2개
     * 삼성전자 1백만원(33%) 평단가 1원*1백만개
     */
    @BeforeEach
    @Transactional
    public void setup() {
        user = userRepository.save(User.builder()
                .email("testtesttesttest@footest.bartest")
                .isVerified(true)
                .password("password!")
                .name("test")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        portfolio = portfolioRepository.save(Portfolio.builder()
                .user(user)
                .createdDate(LocalDateTime.now())
                .country("KOR")
                .isAuto(true)
                .initAsset(4000000)
                .initCash(1000000)
                .currentCash(1000000)
                .riskValue(1)
                .build());

        portfolio.getPortfolioSectors().add(portfolioSectorRepository.save(PortfolioSector.builder()
                .portfolio(portfolio)
                .sector(sectorRepository
                        .findById("G45").get())
                .build()));

        portfolio.getPortfolioTickers().add(portfolioTickerRepository.save(PortfolioTicker.builder()
                .portfolio(portfolio)
                .ticker(tickerRepository.findById("001000").get())
                .initProportion(0.33f)
                .currentProportion(0.33f)
                .number(2)
                .averagePrice(500000f)
                .build()));

        portfolio.getPortfolioTickers().add(portfolioTickerRepository.save(PortfolioTicker.builder()
                .portfolio(portfolio)
                .ticker(tickerRepository.findById("005930").get())
                .initProportion(0.33f)
                .currentProportion(0.33f)
                .number(1000000)
                .averagePrice(1f)
                .build()));
    }

    @Test
    @Transactional
    @DisplayName("스케줄러: 비중 조정 테스트")
    public void testUpdateProportion() {
        portfolioScheduler.updateProportion(portfolio);

        Assertions.assertAll(
            () -> assertNotEquals(0.33f, portfolio.getPortfolioTickers().get(0).getCurrentProportion()),
            () -> assertNotEquals(0.33f, portfolio.getPortfolioTickers().get(1).getCurrentProportion())
        );
    }

    @Test
    @Transactional
    @DisplayName("스케줄러: 비중 조정 후 리밸런싱 알림 생성 테스트")
    public void testDoProportionRebalancing() {
        portfolioScheduler.updateProportion(portfolio);
        portfolioScheduler.createProportionRebalancing(portfolio);

        // then 리밸런싱 반영 시, 각 종목 비중이 초기 비중에서 오차 범위 20% 내로 들어오는지 확인
        float totalAmount = portfolio.getCurrentCash();
        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float number = portfolioTicker.getNumber();
            float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                    .get().getClose().floatValue();
            totalAmount += close*number;
        }

        List<Rebalancing> rebalancings = rebalancingRepository.findAllByPortfolio(portfolio);
        for (RebalancingTicker rebalancingTicker : rebalancings.get(0).getRebalancingTickers()) {
            float number = portfolio.getPortfolioTickers().stream()
                            .filter(portfolioTicker -> portfolioTicker.getTicker().equals(rebalancingTicker.getTicker()))
                            .findFirst().get().getNumber();
            if (rebalancingTicker.getIsBuy())
                number += rebalancingTicker.getNumber();
            else
                number -= rebalancingTicker.getNumber();

            float close = priceRepository.findLatestPriceByTicker(rebalancingTicker.getTicker().getTicker())
                    .get().getClose().floatValue();

            float resultProportion = (close*number)/totalAmount;
            assertTrue(0.8 < resultProportion/0.33 && resultProportion/0.33 < 1.2);
        }
    }
}
