package com.example.eta.scheduler;

import com.example.eta.entity.Portfolio;
import com.example.eta.entity.PortfolioTicker;
import com.example.eta.entity.Rebalancing;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.PriceRepository;
import com.example.eta.repository.RebalancingRepository;
import com.example.eta.repository.RebalancingTickerRepository;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PortfolioScheduler {

    private final PortfolioRepository portfolioRepository;

    private final PriceRepository priceRepository;

    private final RebalancingRepository rebalancingRepository;

    private final RebalancingTickerRepository rebalancingTickerRepository;

    private Logger logger = LoggerFactory.getLogger(PortfolioScheduler.class);

    @Scheduled(cron = "0 0 0 * * 1-5")
    public void doProportionRebalancing() {
        for (Portfolio portfolio : portfolioRepository.findAllByIsAutoIsTrue()) {
            updateProportion(portfolio);
            if(isProportionRebalancingNeeded(portfolio))
                createProportionRebalancing(portfolio);
        }
    }

    public void updateProportion(Portfolio portfolio) {
        float totalAmount = portfolio.getCurrentCash();
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();

        // 1. 종가를 가져와서 각 종목별로 종가*개수 계산
        // 2. 전체 종가*개수 + 현금 계산
        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float number = portfolioTicker.getNumber();
            float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                    .get().getClose().floatValue();

            totalAmount += close*number;
            currentAmountForTicker.put(portfolioTicker, close*number);
        }

        // 3. 1, 2에서 계산한 값 가지고 각 종목별로 비중 계산하고 업데이트
        for (PortfolioTicker portfolioTicker : currentAmountForTicker.keySet()) {
            float currentProportion = currentAmountForTicker.get(portfolioTicker).floatValue() / totalAmount;
            portfolioTicker.setCurrentProportion(currentProportion);
        }

        logger.info("Portfolio: " + portfolio.getPfId() + " 주가별 현재 비중 업데이트됨");
    }

    public boolean isProportionRebalancingNeeded(Portfolio portfolio) {
        // 기존 비중 대비 현재 비중의 차이가 0.2% 이상 나는 경우
        return portfolio.getPortfolioTickers().stream().anyMatch(portfolioTicker -> {
            float initProportion = portfolioTicker.getInitProportion();
            float currentProportion = portfolioTicker.getCurrentProportion();
            return currentProportion / initProportion < 0.8 || currentProportion / initProportion > 1.2;
        });
    }

    
    public void createProportionRebalancing(Portfolio portfolio) {
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();
        Map<PortfolioTicker, Float> targetAmountForTicker = new HashMap<>();

        // 현재 총자산 계산하고, 각 종목별 비중에 따라 목표 보유량(총 가격) 계산
        float totalAmount = portfolio.getCurrentCash();
        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float number = portfolioTicker.getNumber();
            float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                    .get().getClose().floatValue();

            totalAmount += close*number;
            currentAmountForTicker.put(portfolioTicker, close*number);
        } 
       
        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float targetAmount = totalAmount * portfolioTicker.getInitProportion();
            targetAmountForTicker.put(portfolioTicker, targetAmount);
        }
        
        // 매도, 매수 알림 생성
        Rebalancing rebalancing = Rebalancing.builder()
                .portfolio(portfolio)
                .createdDate(LocalDateTime.now())
                .build();
        rebalancingRepository.save(rebalancing);

        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                    .get().getClose().floatValue();
            float targetAmount = targetAmountForTicker.get(portfolioTicker);
            float currentAmount = currentAmountForTicker.get(portfolioTicker);
            float diff = targetAmount - currentAmount;
            if (diff > 0) {
                // 매수
                int numToBuy = (int)(diff / close);
                if (numToBuy == 0) continue;
                RebalancingTicker rebalancingTicker = rebalancingTickerRepository.save(RebalancingTicker.builder()
                        .rebalancing(rebalancing)
                        .number(numToBuy)
                        .ticker(portfolioTicker.getTicker())
                        .isBuy(true)
                        .build());
                rebalancing.getRebalancingTickers().add(rebalancingTicker);
            } else if (diff < 0) {
                // 매도
                diff = -diff;
                int numToSell = (int)(diff / close);
                if (numToSell == 0) continue;
                RebalancingTicker rebalancingTicker = rebalancingTickerRepository.save(RebalancingTicker.builder()
                        .rebalancing(rebalancing)
                        .number(numToSell)
                        .ticker(portfolioTicker.getTicker())
                        .isBuy(false)
                        .build());
                rebalancing.getRebalancingTickers().add(rebalancingTicker);
            }
        }

        logger.info("Portfolio: " + portfolio.getPfId() + " 비중 조정 리밸런싱 알림 생성됨");
    }
}
