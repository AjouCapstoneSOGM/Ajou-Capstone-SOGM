package com.example.eta.service;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.entity.*;
import com.example.eta.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RebalancingService {
    private final RebalancingRepository rebalancingRepository;
    @Autowired
    private PortfolioRepository portfolioRepository;
    @Autowired
    private TickerRepository tickerRepository;
    @Autowired
    private PortfolioTickerRepository portfolioTickerRepository;
    @Autowired
    private PortfolioRecordRepository portfolioRecordRepository;

    // 포트폴리오 ID로 리밸런싱 알림 존재 여부 확인
    public boolean existsRebalancingByPortfolioId(Integer pfId) {
        return rebalancingRepository.existsByPortfolioPfId(pfId);
    }

    // 알림 ID로 리밸린성 알림 삭제
    public void deleteRebalancing(Integer rnId) throws Exception {
        if (!rebalancingRepository.existsById(rnId)) {
            throw new Exception("Rebalancing notification not found with id: " + rnId);
        }
        rebalancingRepository.deleteById(rnId);
    }

    // 포트폴리오 ID로 모든 리밸런싱 알림 받아오기
    public List<RebalancingDto.RebalancingListDto> getAllRebalancingsByPortfolioId(Integer pfId) {

        List<Rebalancing> rebalancings = rebalancingRepository.findByPortfolioPfId(pfId);
        List<RebalancingDto.RebalancingListDto> rebalancingListDtos = new ArrayList<>();
        for (Rebalancing rebalancing : rebalancings) {
            int rnId = rebalancing.getRnId();
            List<RebalancingDto.RebalancingInfo> rebalancingInfos = new ArrayList<>();
            for (RebalancingTicker rebalancingTicker : rebalancing.getRebalancingTickers()) {
                Optional<Ticker> ticker = tickerRepository.findById(rebalancingTicker.getTicker().getTicker());
                ticker.ifPresent(value -> rebalancingInfos.add(new RebalancingDto.RebalancingInfo(
                        value.getTicker(),
                        value.getName(),
                        rebalancingTicker.getNumber(),
                        rebalancingTicker.getIsBuy()
                )));
            }
            rebalancingListDtos.add(RebalancingDto.RebalancingListDto.builder()
                    .rnId(rnId)
                    .rebalancings(rebalancingInfos)
                    .build());
        }

        return rebalancingListDtos;
    }
    @Transactional
    public boolean applyRebalancing(Integer port_id, Integer rn_id, RebalancingDto rebalancingDto) {
        Optional<Portfolio> optionalPortfolio = portfolioRepository.findById(port_id);
        Portfolio portfolio = optionalPortfolio.get();

        for (RebalancingDto.RebalancingDetail detail : rebalancingDto.getRnList()) {
            Ticker ticker = tickerRepository.findByTicker(detail.getTicker());
            if (ticker != null) {
                // PortfolioTicker 정보를 조회하거나 새로 생성
                Optional<PortfolioTicker> optionalPortfolioTicker = portfolioTickerRepository.findByPortfolioAndTicker(portfolio, ticker);
                PortfolioTicker portfolioTicker;
                if (!optionalPortfolioTicker.isPresent()) {
                    portfolioTicker = new PortfolioTicker();
                    portfolioTicker.setPortfolio(portfolio);
                    portfolioTicker.setTicker(ticker);
                    portfolioTicker.setAveragePrice(0.f);
                    portfolioTicker.setNumber(0);
                } else {
                    portfolioTicker = optionalPortfolioTicker.get();
                }

                if (detail.isBuy()) {
                    // 매수인 경우, 새로운 평균 가격을 계산하고 주식 수를 증가
                    float newAveragePrice = ((portfolioTicker.getAveragePrice() * portfolioTicker.getNumber()) +
                            (detail.getPrice() * detail.getQuantity())) /
                            (portfolioTicker.getNumber() + detail.getQuantity());
                    portfolioTicker.setAveragePrice(newAveragePrice);
                    portfolioTicker.setNumber(portfolioTicker.getNumber() + detail.getQuantity());
                    // 포트폴리오의 현재 현금 잔액을 업데이트
                    portfolio.setCurrentCash(portfolio.getCurrentCash() - (detail.getPrice() * detail.getQuantity()));
                } else {
                    // 매도인 경우, 주식 수를 감소시키고 잔액을 증가
                    portfolioTicker.setNumber(portfolioTicker.getNumber() - detail.getQuantity());
                    portfolio.setCurrentCash(portfolio.getCurrentCash() + (detail.getPrice() * detail.getQuantity()));
                }

                // 주식 수가 0이 되면 PortfolioTicker 레코드를 삭제
                if (portfolioTicker.getNumber() == 0) {
                    portfolioTickerRepository.delete(portfolioTicker);
                } else {
                    portfolioTickerRepository.save(portfolioTicker);
                }

                // 매수/매도 기록을 PortfolioRecord에 저장
                PortfolioRecord record = new PortfolioRecord();
                record.setPortfolio(portfolio);
                record.setTicker(ticker);
                record.setQuantity(detail.getQuantity());
                record.setPrice(detail.getPrice());
                record.setBuy(detail.isBuy());
                portfolioRecordRepository.save(record);
            }
        }
        // 포트폴리오 정보를 업데이트
        portfolioRepository.save(portfolio);
        return true;
    }
}

