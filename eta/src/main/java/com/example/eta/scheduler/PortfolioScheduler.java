package com.example.eta.scheduler;

import com.example.eta.entity.Portfolio;
import com.example.eta.entity.PortfolioTicker;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.PriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PortfolioScheduler {

    private final PortfolioRepository portfolioRepository;

    private final PriceRepository priceRepository;

    @Scheduled(cron = "0 0 0 * * 1-5")
    public void createRebalancingNotification() {
        for (Portfolio portfolio : portfolioRepository.findAllByIsAutoIsTrue()) {
            updateProportion(portfolio);
        }
    }

    public void updateProportion(Portfolio portfolio) {
        float totalValue = portfolio.getCurrentCash();
        Map<PortfolioTicker, Double> closeMulNumForTicker = new HashMap<>();

        // 1. 종가를 가져와서 각 종목별로 종가*개수 계산
        // 2. 전체 종가*개수 + 현금 계산
        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float number = portfolioTicker.getNumber();
            double close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                    .get().getClose();

            totalValue += close*number;
            closeMulNumForTicker.put(portfolioTicker, close*number);
        }

        // 3. 1, 2에서 계산한 값 가지고 각 종목별로 비중 계산하고 업데이트
        for (PortfolioTicker portfolioTicker : closeMulNumForTicker.keySet()) {
            float currentProportion = closeMulNumForTicker.get(portfolioTicker).floatValue() / totalValue;
            portfolioTicker.setCurrentProportion(currentProportion);
        }
    }
}
