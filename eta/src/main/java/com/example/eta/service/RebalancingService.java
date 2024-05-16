package com.example.eta.service;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.Rebalancing;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.entity.Ticker;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.RebalancingRepository;
import com.example.eta.repository.TickerRepository;
import com.example.eta.scheduler.PortfolioScheduler;
import com.example.eta.entity.*;
import com.example.eta.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    public boolean applyRebalancing(Integer pfId, Integer rnId, RebalancingDto.RebalancingApplyListDto rebalancingApplyListDto) {
        // TODO: 리밸런싱 알림과 dto에 담겨있는 정보가 일치하는지

        Optional<Portfolio> optionalPortfolio = portfolioRepository.findById(pfId);
        Portfolio portfolio = optionalPortfolio.get();

        for (RebalancingDto.RebalancingApplyInfo detail : rebalancingApplyListDto.getRnList()) {
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

        // 비중 계산
        // 초기 포트폴리오일 경우 초기 비중도 초기화
        boolean isInitial = portfolio.getCreatedDate() == null ? true : false;
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();
        float totalAmount = portfolioService.calculateProportionAndReturnTotalAmount(portfolio, true, currentAmountForTicker);

        for (PortfolioTicker portfolioTicker : currentAmountForTicker.keySet()) {
            float currentProportion = currentAmountForTicker.get(portfolioTicker).floatValue() / totalAmount;
            portfolioTicker.setCurrentProportion(currentProportion);
            if (isInitial) {
                portfolioTicker.setInitProportion(currentProportion);
            }
            portfolioTickerRepository.save(portfolioTicker);
        }

        if (isInitial) {
            portfolio.setInitCash(portfolio.getCurrentCash());
        }

        // 리밸런싱 알림 삭제
        rebalancingRepository.delete(rebalancingRepository.findById(rnId).get());

        // 포트폴리오 정보를 업데이트
        portfolio.setCreatedDate(LocalDateTime.now());
        portfolioRepository.save(portfolio);
        return true;
    }

    public int executeRebalancingAndGetNotificationId(int pfId) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();

        portfolioScheduler.updateProportion(portfolio);
        if(portfolioScheduler.isProportionRebalancingNeeded(portfolio)) {
            return portfolioScheduler.createProportionRebalancing(portfolio);
        }
        else return -1;
    }
}
