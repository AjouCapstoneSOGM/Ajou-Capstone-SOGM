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

@SpringBootTest
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
//포트폴리오를 찾을 수 없는 경우: 포트폴리오가 존재하지 않을 때 false를 반환하는지 테스트
    @Test
    public void testApplyRebalancing_PortfolioNotFound() {
        Integer port_id = 1;
        Integer rn_id = 1;
        RebalancingDto dto = new RebalancingDto(); // Assume this is properly set up

        when(portfolioRepository.findById(port_id)).thenReturn(Optional.empty());

        boolean result = rebalancingService.applyRebalancing(port_id, rn_id, dto);

        assertFalse(result);
        verify(portfolioRepository).findById(port_id);
        verifyNoMoreInteractions(tickerRepository, portfolioTickerRepository, portfolioRecordRepository);
    }

    //포트폴리오, 티커, 포트폴리오 티커가 모두 존재하는 경우, 매수 거래가 성공적으로 처리되는지 확인
    //이때 평균 가격과 주식 수가 올바르게 업데이트 되는지, 그리고 거래 기록이 DB에 저장되는지 테스트
    @Test
    public void testApplyRebalancing_SuccessfulBuyTransaction() {
        Integer port_id = 1;
        Integer rn_id = 1;
        RebalancingDto dto = new RebalancingDto();
        RebalancingDto.RebalancingDetail detail = new RebalancingDto.RebalancingDetail("041241", true, 5, 5450.0f);
        dto.setRnList(new ArrayList<>());
        dto.getRnList().add(detail);

        Portfolio portfolio = new Portfolio();
        Ticker ticker = new Ticker();
        PortfolioTicker portfolioTicker = new PortfolioTicker();
        portfolioTicker.setAveragePrice(5000.0f);
        portfolioTicker.setNumber(10);

        when(portfolioRepository.findById(port_id)).thenReturn(Optional.of(portfolio));
        when(tickerRepository.findByTicker(detail.getTicker())).thenReturn(ticker);
        when(portfolioTickerRepository.findByPortfolioAndTicker(portfolio, ticker)).thenReturn(Optional.of(portfolioTicker));

        boolean result = rebalancingService.applyRebalancing(port_id, rn_id, dto);

        assertTrue(result);
        verify(portfolioRepository).save(portfolio);
        verify(portfolioTickerRepository).save(portfolioTicker);
        verify(portfolioRecordRepository).save(any(PortfolioRecord.class));
    }

}