package com.example.eta.scheduler;

import com.example.eta.dto.PushMessageDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.PortfolioTicker;
import com.example.eta.entity.Rebalancing;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.PriceRepository;
import com.example.eta.repository.RebalancingRepository;
import com.example.eta.repository.RebalancingTickerRepository;
import com.example.eta.service.PortfolioService;
import jakarta.transaction.Transactional;
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

    private final PushNotificationService pushNotificationService;
    private final PortfolioService portfolioService;
    private final PortfolioRepository portfolioRepository;
    private final PriceRepository priceRepository;
    private final RebalancingRepository rebalancingRepository;
    private final RebalancingTickerRepository rebalancingTickerRepository;

    private Logger logger = LoggerFactory.getLogger(PortfolioScheduler.class);

    @Scheduled(cron = "0 0 0 * * 1-5")
    public void doProportionRebalancing() {
        for (Portfolio portfolio : portfolioRepository.findAllByIsAutoIsTrue()) {
            updateProportion(portfolio);
            if (isProportionRebalancingNeeded(portfolio)) {
                int rnId = createProportionRebalancing(portfolio);
                sendRebalancingPushNotification(portfolio.getUser().getToken().getExpoPushToken(), portfolio, rnId);
            }
        }
    }

    @Transactional
    public void updateProportion(Portfolio portfolio) {
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();
        float totalAmount = portfolioService.calculateProportionAndReturnTotalAmount(portfolio, false, currentAmountForTicker);

        for (PortfolioTicker portfolioTicker : currentAmountForTicker.keySet()) {
            float currentProportion = currentAmountForTicker.get(portfolioTicker).floatValue() / totalAmount;
            portfolioTicker.setCurrentProportion(currentProportion);
        }
    }

    public boolean isProportionRebalancingNeeded(Portfolio portfolio) {
        // 기존 비중 대비 현재 비중의 차이가 0.2% 이상 나는 경우
        return portfolio.getPortfolioTickers().stream().anyMatch(portfolioTicker -> {
            float initProportion = portfolioTicker.getInitProportion();
            float currentProportion = portfolioTicker.getCurrentProportion();
            return currentProportion / initProportion < 0.8 || currentProportion / initProportion > 1.2;
        });
    }

    @Transactional
    public int createProportionRebalancing(Portfolio portfolio) {
        // 현재 총자산 계산하고, 각 종목별 비중에 따라 목표 보유량(총 가격) 계산
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();
        Map<PortfolioTicker, Float> targetAmountForTicker = new HashMap<>();
        float totalAmount = portfolioService.calculateProportionAndReturnTotalAmount(portfolio, false, currentAmountForTicker);


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
                int numToBuy = (int) (diff / close);
                if (numToBuy == 0) continue;
                RebalancingTicker rebalancingTicker = rebalancingTickerRepository.save(RebalancingTicker.builder()
                        .rebalancing(rebalancing)
                        .number(numToBuy)
                        .ticker(portfolioTicker.getTicker())
                        .isBuy(true)
                        .price(close)
                        .build());
                rebalancing.getRebalancingTickers().add(rebalancingTicker);
            } else if (diff < 0) {
                // 매도
                diff = -diff;
                int numToSell = (int) (diff / close);
                if (numToSell == 0) continue;
                RebalancingTicker rebalancingTicker = rebalancingTickerRepository.save(RebalancingTicker.builder()
                        .rebalancing(rebalancing)
                        .number(numToSell)
                        .ticker(portfolioTicker.getTicker())
                        .isBuy(false)
                        .price(close)
                        .build());
                rebalancing.getRebalancingTickers().add(rebalancingTicker);
            }
        }
        return rebalancing.getRnId();
    }

    public void sendRebalancingPushNotification(String to, Portfolio portfolio, int rnId) {
        String title = "리밸런싱 알림 생성";

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(portfolio.getName()).append("에 리밸런싱 해야 할 종목이 있어요!\n");
        for(RebalancingTicker rebalancingTicker : rebalancingRepository.getReferenceById(rnId).getRebalancingTickers()) {
            stringBuilder.append("\n").append(rebalancingTicker.getTicker().getName()).append("(").append(rebalancingTicker.getTicker().getTicker()).append(") ");
            stringBuilder.append(rebalancingTicker.getNumber()).append("개 ");
            if(rebalancingTicker.getIsBuy()){
                stringBuilder.append("매수");
            }else{
                stringBuilder.append("매도");
            }
        }
        String body = stringBuilder.toString();

        PushMessageDto.PushMessageData data = PushMessageDto.PushMessageData.builder()
                .pfId(portfolio.getPfId())
                .rnId(rnId)
                .build();

        pushNotificationService.triggerPushNotification(to, title, body, data);
    }
}
