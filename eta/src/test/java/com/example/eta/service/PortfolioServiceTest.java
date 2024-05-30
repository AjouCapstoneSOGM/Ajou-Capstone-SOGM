package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.*;
import com.example.eta.auth.enums.RoleType;
import com.example.eta.repository.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class PortfolioServiceTest {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PortfolioRecordRepository portfolioRecordRepository;

    @Autowired
    private RebalancingRepository rebalancingRepository;

    @Autowired
    private PortfolioTickerRepository portfolioTickerRepository;

    @InjectMocks
    private PortfolioService portfolioService;

    @Test
    @DisplayName("자동 포트폴리오 생성")
    @Transactional
    public void testCreateInitAutoPortfolio() throws Exception {
        // given 유저 생성
        User user = userRepository.save(new User().builder()
                .email("james001@foo.bar")
                .isVerified(false)
                .password("password!")
                .name("James")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        // when 포트폴리오 생성
        PortfolioDto.CreateRequestDto createRequestDto = PortfolioDto.CreateRequestDto.builder()
                .country("KOR")
                .sector(List.of("G25"))
                .asset(10000000)
                .riskValue(1).build();
        int pfId = portfolioService.createInitAutoPortfolio(user, createRequestDto).getPfId();

        // then DB에서 가져오기, 유저id 정보가 맞는지, createdDate가 null인지
        Portfolio portfolio = portfolioRepository.findById(pfId).get();
        Assertions.assertAll(
                () -> assertEquals(portfolio.getUser().getUserId(), user.getUserId()),
                () -> assertTrue(portfolio.getName().equals(user.getName() + "의 자동 포트폴리오 " + user.getPortfolios().size())),
                () -> assertNull(portfolio.getCreatedDate())
        );
    }

    @Test
    @DisplayName("자동 포트폴리오 초기화(생성된 결과 반영, 리밸런싱 알림 초기화)")
    @Transactional
    public void testInitializeAutoPortfolio() throws Exception {
        User user = userRepository.save(new User().builder()
                .email("james001@foo.bar")
                .isVerified(false)
                .password("password!")
                .name("James")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());
        String sector = "G25";
        PortfolioDto.CreateRequestDto createRequestDto = PortfolioDto.CreateRequestDto.builder()
                .country("KOR")
                .sector(List.of(sector))
                .asset(10000000)
                .riskValue(1).build();
        Portfolio portfolio = portfolioService.createInitAutoPortfolio(user, createRequestDto);

        portfolioService.initializeAutoPortfolio(portfolio, createRequestDto);
        Rebalancing rebalancing = rebalancingRepository.findAllByPortfolio(portfolio).get(0);
        List<PortfolioTicker> portfolioTickers = portfolioTickerRepository.findAllByPortfolio(portfolio);

        // 상위 10개는 관심 섹터에 대한 티커, 나머지는 안전자산인지 확인
        // 종목 보유량 0인지 확인
        int countTicker = 0;
        for (PortfolioTicker pt : portfolioTickers) {
            if (countTicker < 10) {
                assertEquals(sector, pt.getTicker().getSector().getSectorId());
            } else {
                assertEquals("안전자산", pt.getTicker().getEquity());
            }
            assertEquals(0, portfolioTickers.get(0).getNumber());
            countTicker++;
        }

        // 리밸런싱 알림 생성 확인
        assertEquals(countTicker, rebalancing.getRebalancingTickers().size());
        for (RebalancingTicker rt : rebalancing.getRebalancingTickers()) {
            assertTrue(rt.getIsBuy());
            assertNotEquals(0, rt.getNumber());
            assertNotEquals(0, rt.getPrice());
        }
    }
    @Test
    void testSellStock_ManualPortfolio_CashNotUpdated() {
        // Arrange
        Integer pfId = 1;
        String ticker = "AAPL";
        int existingQuantity = 10;
        int sellQuantity = 5;
        float sellPrice = 150.0f;

        PortfolioDto.sellRequestDto sellRequestDto = PortfolioDto.sellRequestDto.builder()
                .ticker(ticker)
                .quantity(sellQuantity)
                .price(sellPrice)
                .isBuy(false)
                .build();

        String tickerId = "005930";
        Ticker tickerEntity = new Ticker();
        tickerEntity.setName("Sample Name");
        tickerEntity.setTicker(tickerId);

        Portfolio portfolio = Portfolio.builder()
                .pfId(pfId)
                .isAuto(false)
                .currentCash(1000.0f)
                .build();

        PortfolioTicker portfolioTicker = PortfolioTicker.builder()
                .portfolio(portfolio)
                .ticker(tickerEntity)
                .number(existingQuantity)
                .build();

        when(portfolioTickerRepository.findByPortfolioAndTicker(portfolio, tickerEntity))
                .thenReturn(Optional.of(portfolioTicker));
        when(portfolioRepository.findById(pfId)).thenReturn(Optional.of(portfolio));

        // Act
        portfolioService.sellStock(pfId, sellRequestDto);

        // Assert
        verify(portfolioTickerRepository, times(1)).save(any(PortfolioTicker.class));
        verify(portfolioRecordRepository, times(1)).save(any(PortfolioRecord.class));
        verify(portfolioRepository, times(1)).save(any(Portfolio.class));
        assertEquals(1000.0f, portfolio.getCurrentCash(), 0.01);
    }

}
