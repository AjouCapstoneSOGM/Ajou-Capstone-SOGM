package com.example.eta.scheduler;

import com.example.eta.dto.PushMessageDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.PortfolioTicker;
import com.example.eta.entity.Rebalancing;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.exception.FailToSendPushNotificationException;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

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
    @Transactional
    public void doProportionRebalancing() {
        for (Portfolio portfolio : portfolioRepository.findAllByIsAutoIsTrue()) {
            portfolioService.updateProportion(portfolio, false, false);
            if (isProportionRebalancingNeeded(portfolio)) {
                int rnId = createProportionRebalancing(portfolio);
                try {
                    sendRebalancingPushNotification(portfolio.getUser().getToken().getExpoPushToken(), portfolio, rnId);
                }
                catch (FailToSendPushNotificationException e) {
                    logger.error("Failed to send push notification to " + portfolio.getUser().getEmail());
                }
            }
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
        // 현재 총자산 계산하고, 각 종목별 비중에 따라 목표 보유 개수 계산
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();
        Map<PortfolioTicker, Float> newAssetNum = new HashMap<>();
        float totalCurrentInvest = portfolioService.calculateAmount(portfolio, false, currentAmountForTicker);

        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                    .get().getClose().floatValue();
            newAssetNum.put(portfolioTicker, (totalCurrentInvest * portfolioTicker.getInitProportion() / close));
        }

        // Optimize
        Map<PortfolioTicker, Integer> optimizedAssetNum = optimizeInvestment(newAssetNum);

        // 매도, 매수 알림 생성
        Rebalancing rebalancing = Rebalancing.builder()
                .portfolio(portfolio)
                .createdDate(LocalDateTime.now())
                .build();
        rebalancingRepository.save(rebalancing);

        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                    .get().getClose().floatValue();
            int newAssetNumForTicker = optimizedAssetNum.get(portfolioTicker);
            int currentAssetNumForTicker = portfolioTicker.getNumber();
            int diff = newAssetNumForTicker - currentAssetNumForTicker;
            if (diff > 0) {
                // 매수
                int numToBuy = diff;
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
                int numToSell = -diff;
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

    private Map<PortfolioTicker, Integer> optimizeInvestment(Map<PortfolioTicker, Float> initAssetNum) {
        int MAX_ITERATION = 100;
        Map<PortfolioTicker, Integer> assetNumResult = new HashMap<>();

        // initAssetNum의 값들을 출력하기
        for (PortfolioTicker portfolioTicker : initAssetNum.keySet()) {
            logger.info("initAssetNum: " + portfolioTicker.getTicker().getTicker() + " " + initAssetNum.get(portfolioTicker));
        }

        // 안전자산 제외한 종목들에 대해 주식 수 계산하기
        Map<PortfolioTicker, Float> initAssetNumWithoutSafe = new HashMap<>();
        Map<PortfolioTicker, Integer> initAssetNumWithoufSafeOld = new HashMap<>();
        Map<PortfolioTicker, Integer> initAssetNumSafe = new HashMap<>(); // 안전자산 종목 주식 수(나중에 합쳐서 결과로 반환)
        for (PortfolioTicker portfolioTicker : initAssetNum.keySet()) {
            if (portfolioTicker.getTicker().getEquity().equals("안전자산")) {
                initAssetNumSafe.put(portfolioTicker, (int) Math.floor(initAssetNum.get(portfolioTicker)));
            } else {
                initAssetNumWithoutSafe.put(portfolioTicker, initAssetNum.get(portfolioTicker));
                initAssetNumWithoufSafeOld.put(portfolioTicker, (int) Math.floor(initAssetNum.get(portfolioTicker)));
            }
        }

        // 소수 부분, 소수 부분 총합 계산
        float cash = 0.0f;
        Map<PortfolioTicker, Float> decimalPart = new HashMap<>();
        for (PortfolioTicker portfolioTicker : initAssetNumWithoutSafe.keySet()) {
            float num = initAssetNumWithoutSafe.get(portfolioTicker);
            decimalPart.put(portfolioTicker, num - (int) num);
            cash += num;
        }

        for (int i = 0; i < MAX_ITERATION; i++) {
            // 배분할 현금을 최초 비중별로 나누고, 주식 수 정수부분, 소수부분 계산
            Map<PortfolioTicker, Integer> assetNumInt = new HashMap<>();
            Map<PortfolioTicker, Float> remainingDecimals = new HashMap<>();
            for (PortfolioTicker portfolioTicker : initAssetNumWithoutSafe.keySet()) {
                float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                        .get().getClose().floatValue();
                float initProportion = portfolioTicker.getInitProportion();
                assetNumInt.put(portfolioTicker, (int)(cash * initProportion / close));
                remainingDecimals.put(portfolioTicker, cash * initProportion / close - (int)((cash * initProportion) / close));
            }

            // 정수부분만큼 기존 주식 수에 더함
            for (PortfolioTicker portfolioTicker : assetNumInt.keySet()) {
                assetNumInt.put(portfolioTicker, assetNumInt.get(portfolioTicker) + initAssetNumWithoufSafeOld.get(portfolioTicker));
            }

            float newCash = 0.0f;
            for (PortfolioTicker portfolioTicker : remainingDecimals.keySet()) {
                float close = priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                        .get().getClose().floatValue();
                cash += remainingDecimals.get(portfolioTicker) * close;
            }

            // 갱신된 주식 수가 변화가 없거나 더 이상의 금액 배분이 불가능한 경우 종료
            if(assetNumInt.values().stream().reduce(0, Integer::sum) == initAssetNumWithoufSafeOld.values().stream().reduce(0, Integer::sum)
                || Math.abs(cash - newCash) / newCash < 0.001 || cash == newCash || newCash == 0.0) {
                assetNumResult.putAll(assetNumInt);
                assetNumResult.putAll(initAssetNumSafe);
                break;
            }
            initAssetNumWithoufSafeOld = assetNumInt;
            cash = newCash;
        }

        // assetNumResult의 값을 출력하기
        for (PortfolioTicker portfolioTicker : assetNumResult.keySet()) {
            logger.info("assetNumResult: " + portfolioTicker.getTicker().getTicker() + " " + assetNumResult.get(portfolioTicker));
        }

        return assetNumResult;
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
