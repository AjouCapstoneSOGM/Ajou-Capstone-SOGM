package com.example.eta.service;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.entity.*;
import com.example.eta.repository.*;
import com.example.eta.scheduler.PortfolioScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RebalancingService {

    private final PortfolioService portfolioService;
    private final TickerRepository tickerRepository;
    private final RebalancingRepository rebalancingRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioTickerRepository portfolioTickerRepository;
    private final PortfolioRecordRepository portfolioRecordRepository;
    private final PortfolioScheduler portfolioScheduler;

    public boolean existsRebalancingByPortfolioId(Integer pfId) {
        return rebalancingRepository.existsByPortfolioPfId(pfId);
    }

    public void deleteRebalancing(Integer rnId) {
        rebalancingRepository.deleteById(rnId);
    }

    public List<RebalancingDto.RebalancingListDto> getAllRebalancingsByPortfolioId(Integer pfId) {
        List<Rebalancing> rebalancings = rebalancingRepository.findByPortfolioPfId(pfId);
        List<RebalancingDto.RebalancingListDto> rebalancingListDtos = new ArrayList<>();
        for (Rebalancing rebalancing : rebalancings) {
            int rnId = rebalancing.getRnId();
            LocalDateTime createdDate = rebalancing.getCreatedDate();
            List<RebalancingDto.RebalancingInfoDto> rebalancingInfos = new ArrayList<>();
            for (RebalancingTicker rebalancingTicker : rebalancing.getRebalancingTickers()) {
                Optional<Ticker> ticker = tickerRepository.findById(rebalancingTicker.getTicker().getTicker());
                ticker.ifPresent(value -> rebalancingInfos.add(new RebalancingDto.RebalancingInfoDto(
                        value.getTicker(),
                        value.getName(),
                        rebalancingTicker.getNumber(),
                        rebalancingTicker.getIsBuy(),
                        rebalancingTicker.getPrice()
                )));
            }
            rebalancingListDtos.add(RebalancingDto.RebalancingListDto.builder()
                    .rnId(rnId)
                    .createdDate(createdDate)
                    .rebalancings(rebalancingInfos)
                    .build());
        }
        return rebalancingListDtos;
    }

    @Transactional
    public boolean applyRebalancing(Integer pfId, Integer rnId, RebalancingDto.RebalancingApplyListDto rebalancingApplyListDto) {
        // TODO: 리밸런싱 알림과 dto에 담겨있는 정보가 일치하는지

        Optional<Portfolio> optionalPortfolio = portfolioRepository.findById(pfId);
        Portfolio portfolio = optionalPortfolio.get();

        for (RebalancingDto.RebalancingApplyInfoDto detail : rebalancingApplyListDto.getRnList()) {
            Ticker ticker = tickerRepository.findByTicker(detail.getTicker());
            if (ticker != null) {
                // PortfolioTicker 정보를 조회하거나 새로 생성
                Optional<PortfolioTicker> optionalPortfolioTicker = portfolioTickerRepository.findByPortfolioAndTicker(portfolio, ticker);
                PortfolioTicker portfolioTicker;
                if (!optionalPortfolioTicker.isPresent()) {
                    portfolioTicker = portfolioTickerRepository.save(PortfolioTicker.builder()
                            .portfolio(portfolio)
                            .ticker(ticker)
                            .averagePrice(0.f)
                            .number(0)
                            .initProportion(0.f)
                            .currentProportion(0.f)
                            .build());
                    portfolio.getPortfolioTickers().add(portfolioTicker);
                } else {
                    portfolioTicker = optionalPortfolioTicker.get();
                }

                if (detail.getIsBuy()) {
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
                    portfolio.getPortfolioTickers().remove(portfolioTicker);
                } else {
                    portfolioTickerRepository.save(portfolioTicker);
                }

                // 매수/매도 기록을 PortfolioRecord에 저장
                portfolioRecordRepository.save(PortfolioRecord.builder()
                        .portfolio(portfolio)
                        .ticker(ticker)
                        .number(detail.getQuantity())
                        .price(detail.getPrice())
                        .isBuy(detail.getIsBuy())
                        .recordDate(LocalDateTime.now())
                        .build());
            }
        }

        // 수동 포트폴리오일 경우 초기 비중을 현재 비중으로 업데이트함
        if (!portfolio.getIsAuto()) {
            portfolioService.updatePortfolioProportion(portfolio, true);
        }
        // 초기화되지 않은 자동 포트폴리오의 날짜, 초기 현금 업데이트
        else if (portfolio.getCreatedDate() == null) {
            portfolioService.setPortfolioInitProportion(portfolio);
            portfolio.setInitCash(portfolio.getCurrentCash());
            portfolio.setCreatedDate(LocalDateTime.now());
        }

        // 리밸런싱 알림 삭제
        rebalancingRepository.delete(rebalancingRepository.findById(rnId).get());

        portfolioRepository.save(portfolio);
        return true;
    }

    public int executeRebalancingAndGetNotificationId(int pfId) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();

        portfolioService.updatePortfolioProportion(portfolio, false);
        if (portfolioScheduler.isProportionRebalancingNeeded(portfolio)) {
            return portfolioScheduler.createProportionRebalancing(portfolio);
        } else return -1;
    }
}
