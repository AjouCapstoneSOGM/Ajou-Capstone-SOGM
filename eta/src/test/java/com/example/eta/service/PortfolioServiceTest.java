package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.*;
import com.example.eta.enums.RoleType;
import com.example.eta.repository.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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
    @Autowired
    private PortfolioService portfolioService;

    @Test
    @DisplayName("자동 포트폴리오 생성")
    @Transactional
    public void testCreateInitAutoPortfolio() throws Exception {
        // given 유저 생성
        User user = userRepository.save(new User().builder()
                .email("suprlux09@ajou.ac.kr")
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
    @DisplayName("수동 포트폴리오 생성")
    @Transactional
    public void testCreateManualPortfolio() throws Exception {
        // given 유저 생성
        User user = userRepository.save(new User().builder()
                .email("suprlux09@ajou.ac.kr")
                .isVerified(false)
                .password("password!")
                .name("James")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        // when 포트폴리오 생성
        List<PortfolioDto.StockDetailDto> stocks = List.of(
                PortfolioDto.StockDetailDto.builder().ticker("005930").quantity(10).price(1000).isBuy(true).build(),
                PortfolioDto.StockDetailDto.builder().ticker("000660").quantity(5).price(50000).isBuy(true).build()
        );

        PortfolioDto.CreateManualRequestDto createManualRequestDto = PortfolioDto.CreateManualRequestDto.builder()
                .name("수동 포트폴리오")
                .country("KOR")
                .stocks(stocks).build();

        int pfId = portfolioService.createManualPortfolio(user, createManualRequestDto);

        Portfolio portfolio = portfolioRepository.findById(pfId).get();
        Assertions.assertAll(
                () -> assertEquals(portfolio.getUser().getUserId(), user.getUserId()),
                () -> assertEquals(portfolio.getName(), createManualRequestDto.getName()),
                () -> assertEquals(portfolio.getCountry(), createManualRequestDto.getCountry()),
                () -> assertEquals(portfolio.getIsAuto(), false),
                () -> assertEquals(portfolio.getCurrentCash(), 0.0f)
        );
        List<PortfolioTicker> portfolioTickers = portfolio.getPortfolioTickers();
        for (PortfolioTicker portfolioTicker : portfolioTickers) {
            assertEquals(portfolioTicker.getInitProportion(), portfolioTicker.getCurrentProportion());
        }
    }

//    @Test
//    @DisplayName("매수 테스트")
//    @Transactional
//    public void testBuyStock() {
//        // given 유저 생성
//        User user = userRepository.save(new User().builder()
//                .email("suprlux09@ajou.ac.kr")
//                .isVerified(false)
//                .password("password!")
//                .name("James")
//                .roleType(RoleType.ROLE_USER)
//                .createdDate(LocalDateTime.now())
//                .enabled(true).build());
//
//        List<PortfolioDto.StockDetailDto> stocks = List.of(
//                PortfolioDto.StockDetailDto.builder().ticker("005930").quantity(5).price(50000).isBuy(true).build(),
//                PortfolioDto.StockDetailDto.builder().ticker("000660").quantity(10).price(50000).isBuy(true).build(),
//                PortfolioDto.StockDetailDto.builder().ticker("035720").quantity(10).price(50000).isBuy(true).build()
//        );
//
//        PortfolioDto.CreateManualRequestDto createManualRequestDto = PortfolioDto.CreateManualRequestDto.builder()
//                .name("수동 포트폴리오")
//                .country("KOR")
//                .stocks(stocks).build();
//
//        int pfId = portfolioService.createManualPortfolio(user, createManualRequestDto);
//
//        portfolioService.buyStock(pfId, PortfolioDto.BuyRequestDto.builder()
//                .ticker("005930")
//                .quantity(5)
//                .price(50000)
//                .isBuy(true)
//                .build());
//        portfolioService.buyStock(pfId, PortfolioDto.BuyRequestDto.builder()
//                .ticker("051910")
//                .quantity(10)
//                .price(50000)
//                .isBuy(true)
//                .build());
//
//        // 모든 주식 개수가 10개이고, 현재 비중이 25%인지 확인
//        for(PortfolioTicker portfolioTicker : portfolioRepository.findById(pfId).get().getPortfolioTickers()) {
//            assertEquals(10, portfolioTicker.getNumber());
//            assertEquals(0.25f, portfolioTicker.getCurrentProportion());
//        }
//    }
//
//    @Test
//    @DisplayName("매도 테스트")
//    @Transactional
//    public void testSellStock() {
//        // given 유저 생성
//        User user = userRepository.save(new User().builder()
//                .email("suprlux09@ajou.ac.kr")
//                .isVerified(false)
//                .password("password!")
//                .name("James")
//                .roleType(RoleType.ROLE_USER)
//                .createdDate(LocalDateTime.now())
//                .enabled(true).build());
//
//        List<PortfolioDto.StockDetailDto> stocks = List.of(
//                PortfolioDto.StockDetailDto.builder().ticker("005930").quantity(15).price(50000).isBuy(true).build(),
//                PortfolioDto.StockDetailDto.builder().ticker("000660").quantity(10).price(50000).isBuy(true).build(),
//                PortfolioDto.StockDetailDto.builder().ticker("035720").quantity(10).price(50000).isBuy(true).build()
//        );
//
//        PortfolioDto.CreateManualRequestDto createManualRequestDto = PortfolioDto.CreateManualRequestDto.builder()
//                .name("수동 포트폴리오")
//                .country("KOR")
//                .stocks(stocks).build();
//
//        int pfId = portfolioService.createManualPortfolio(user, createManualRequestDto);
//
//        portfolioService.sellStock(pfId, PortfolioDto.SellRequestDto.builder()
//                .ticker("005930")
//                .quantity(5)
//                .price(50000)
//                .isBuy(false)
//                .build());
//        portfolioService.sellStock(pfId, PortfolioDto.SellRequestDto.builder()
//                .ticker("035720")
//                .quantity(10)
//                .price(50000)
//                .isBuy(false)
//                .build());
//
//        // 모든 주식 개수가 10개이고, 현재 비중이 50%인지 확인
//        for(PortfolioTicker portfolioTicker : portfolioRepository.findById(pfId).get().getPortfolioTickers()) {
//            assertEquals(10, portfolioTicker.getNumber());
//            assertEquals(0.50f, portfolioTicker.getCurrentProportion());
//        }
//    }

    @Test
    @DisplayName("자동 포트폴리오 초기화(생성된 결과 반영, 리밸런싱 알림 초기화)")
    @Transactional
    public void testInitializeAutoPortfolio() throws Exception {
        User user = userRepository.save(new User().builder()
                .email("suprlux09@ajou.ac.kr")
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
    @DisplayName("포트폴리오 이름 변경")
    @Transactional
    public void testUpdatePortfolioName() {
        User user = userRepository.save(new User().builder()
                .email("suprlux09@ajou.ac.kr")
                .isVerified(false)
                .password("password!")
                .name("James")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        Portfolio portfolio = portfolioRepository.save(new Portfolio().builder()
                .pfId(40)
                .name("Portfolio")
                .user(user)
                .isAuto(false)
                .country("KOR")
                .currentCash(1000.0f)
                .build()
        );

        String newName = "New Portfolio Name";
        portfolioService.updatePortfolioName(portfolio.getPfId(), newName);

        Portfolio updatedPortfolio = portfolioRepository.findById(portfolio.getPfId()).orElseThrow();
        assertEquals(newName, updatedPortfolio.getName());
    }
}
