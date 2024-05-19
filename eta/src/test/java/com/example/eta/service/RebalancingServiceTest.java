package com.example.eta.service;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.PortfolioRecord;
import com.example.eta.entity.PortfolioTicker;
import com.example.eta.entity.Ticker;
import com.example.eta.repository.PortfolioRecordRepository;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.PortfolioTickerRepository;
import com.example.eta.repository.TickerRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RebalancingServiceTest {
    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private TickerRepository tickerRepository;

    @Mock
    private PortfolioTickerRepository portfolioTickerRepository;

    @Mock
    private PortfolioRecordRepository portfolioRecordRepository;

    @InjectMocks
    private RebalancingService rebalancingService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // TODO: 테스트 코드 수정
    //포트폴리오, 티커, 포트폴리오 티커가 모두 존재하는 경우, 매수 거래가 성공적으로 처리되는지 확인
    //이때 평균 가격과 주식 수가 올바르게 업데이트 되는지, 그리고 거래 기록이 DB에 저장되는지 테스트
//    @Test
//    public void testApplyRebalancing_SuccessfulBuyTransaction() {
//        Integer pfId = 1;
//        Integer rnId = 1;
//        RebalancingDto.RebalancingApplyListDto dto = new RebalancingDto.RebalancingApplyListDto();
//        dto.setRnList(new ArrayList<>());
//        RebalancingDto.RebalancingApplyInfo detail = new RebalancingDto.RebalancingApplyInfo("041241", true, 5, 5450.0f);
//        dto.getRnList().add(detail);
//
//        Portfolio portfolio = new Portfolio();
//        Ticker ticker = new Ticker();
//        PortfolioTicker portfolioTicker = new PortfolioTicker();
//        portfolioTicker.setAveragePrice(5000.0f);
//        portfolioTicker.setNumber(10);
//
//        when(portfolioRepository.findById(pfId)).thenReturn(Optional.of(portfolio));
//        when(tickerRepository.findByTicker(detail.getTicker())).thenReturn(ticker);
//        when(portfolioTickerRepository.findByPortfolioAndTicker(portfolio, ticker)).thenReturn(Optional.of(portfolioTicker));
//
//        boolean result = rebalancingService.applyRebalancing(pfId, rnId, dto);
//
//        assertTrue(result);
//        verify(portfolioRepository).save(portfolio);
//        verify(portfolioTickerRepository).save(portfolioTicker);
//        verify(portfolioRecordRepository).save(any(PortfolioRecord.class));
//    }

}