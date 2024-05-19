package com.example.eta.service;

import com.example.eta.api.ApiClient;
import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.*;
import com.example.eta.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final TickerRepository tickerRepository;
    private final PortfolioRepository portfolioRepository;
    private final SectorRepository sectorRepository;
    private final PortfolioSectorRepository portfolioSectorRepository;
    private final PortfolioTickerRepository portfolioTickerRepository;
    private final RebalancingRepository rebalancingRepository;
    private final RebalancingTickerRepository rebalancingTickerRepository;
    private final PriceRepository priceRepository;
    private final ApiClient apiClient;

    /**
     * 포트폴리오의 종목별 비중을 계산하고, 포트폴리오의 총자산(현금+보유종목)을 반환합니다.
     *
     * <p> {@code averagePriceUpdated} 가 {@code true}이면 평단가를 기준으로 비중을 계산하고, {@code false}이면 가장 최근의 종가를 기준으로 비중을 계산힙니다.
     *
     * <p> 평단가를 기준으로 비중을 계산하는 경우는 리밸런싱 알림을 반영할 때, 종가를 기준으로 비중을 계산하는 경우는 주기적으로 포트폴리오의 비중을 업데이트할 때입니다.
     *
     * <p> {@code currentAmountForTicker}에 종목별로 비중 값이 담깁니다.
     */
    public float calculateProportionAndReturnTotalAmount(Portfolio portfolio, boolean averagePriceUpdated, Map<PortfolioTicker, Float> currentAmountForTicker) {
        float totalAmount = portfolio.getCurrentCash();
        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float number = portfolioTicker.getNumber();
            float price = averagePriceUpdated ? portfolioTicker.getAveragePrice() :
                    priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                            .get().getClose().floatValue();
            totalAmount += price * number;
            currentAmountForTicker.put(portfolioTicker, price * number);
        }
        return totalAmount;
    }


    @Transactional
    public Portfolio createInitAutoPortfolio(User user, PortfolioDto.CreateRequestDto createRequestDto) {
        Portfolio portfolio = new Portfolio().builder()
                .user(user)
                .name(createRequestDto.getName())
                .country(createRequestDto.getCountry())
                .isAuto(true)
                .initAsset(createRequestDto.getAsset())
                .initCash(createRequestDto.getAsset())
                .currentCash(createRequestDto.getAsset())
                .riskValue(createRequestDto.getRiskValue())
                .build();
        portfolioRepository.save(portfolio);

        for (Sector sector : sectorRepository.findAllById(createRequestDto.getSector())) {
            PortfolioSector portfolioSector = new PortfolioSector().builder()
                    .portfolio(portfolio)
                    .sector(sector)
                    .build();
            portfolioSectorRepository.save(portfolioSector);
        }

        return portfolio;
    }

    @Transactional
    public void initializeAutoPortfolio(Portfolio portfolio, PortfolioDto.CreateRequestDto createRequestDto) throws Exception {
        // 섹터별 상위 10개 종목 선택
        List<Ticker> tickers = tickerRepository.findTopTickersBySector(createRequestDto.getSector().get(0), 10, createRequestDto.getCountry());

        // 안전자산 종목 추가
        tickers.addAll(tickerRepository.findSafeAssetTickers(createRequestDto.getCountry()));

        // 최초 리밸런싱 알림 생성
        List<Integer> stockNumPerTicker = getCreatedResultFromFastAPI(createRequestDto, tickers);
        setInitAutoPortfolio(portfolio, tickers, stockNumPerTicker);
    }

    public List<Integer> getCreatedResultFromFastAPI(PortfolioDto.CreateRequestDto createRequestDto, List<Ticker> tickers) throws Exception {
        List<String> postfixedTickers = new ArrayList<>();
        for (Ticker ticker : tickers) {
            if (ticker.getExchange().equals("KOSPI")) {
                postfixedTickers.add(ticker.getTicker() + ".KS");
            } else if (ticker.getExchange().equals("KOSDAQ")) {
                postfixedTickers.add(ticker.getTicker() + ".KQ");
            }
        }

        PortfolioDto.CreatedResultFromFastApiDto createdResultFromFastApiDto = apiClient.getCreatedPortfolioApi(PortfolioDto.CreateRequestToFastApiDto.builder()
                .tickers(postfixedTickers)
                .safe_asset_ratio(
                        createRequestDto.getRiskValue() == 1 ? 0.3f :
                                createRequestDto.getRiskValue() == 2 ? 0.2f : 0.1f
                )
                .initial_cash((int) createRequestDto.getAsset())
                .build()).block().getBody();
        List<Integer> stockNumPerTicker = createdResultFromFastApiDto.getInt_asset_num();

        return stockNumPerTicker;
    }

    public void setInitAutoPortfolio(Portfolio portfolio, List<Ticker> tickers, List<Integer> stockNumPerTicker) {
        Rebalancing rebalancing = Rebalancing.builder()
                .portfolio(portfolio)
                .createdDate(LocalDateTime.now())
                .build();
        rebalancingRepository.save(rebalancing);

        for (int i = 0; i < tickers.size(); i++) {
            RebalancingTicker rebalancingTicker = rebalancingTickerRepository.save(RebalancingTicker.builder()
                    .rebalancing(rebalancing)
                    .ticker(tickers.get(i))
                    .isBuy(true)
                    .number(stockNumPerTicker.get(i))
                    .build());
            rebalancing.getRebalancingTickers().add(rebalancingTicker);

            PortfolioTicker portfolioTicker = portfolioTickerRepository.save(PortfolioTicker.builder()
                    .portfolio(portfolio)
                    .ticker(tickers.get(i))
                    .number(0)
                    .averagePrice(0.0f)
                    .initProportion(0.0f)
                    .currentProportion(0.0f)
                    .build());
            portfolio.getPortfolioTickers().add(portfolioTicker);
        }

        // TODO: 채권 추가

        portfolioRepository.save(portfolio);
    }

    public void deletePortfolio(Integer pfId) {
        portfolioRepository.deleteById(pfId);
    }

    public PortfolioDto.PerformanceResponseDto getPerformanceData(Integer pfId) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();

        List<PortfolioDto.PortfolioPerformance> portfolioPerformances = new ArrayList<>();
        for (PortfolioTicker pt : portfolio.getPortfolioTickers()) {
            Ticker ticker = pt.getTicker();
            portfolioPerformances.add(PortfolioDto.PortfolioPerformance.builder()
                    .ticker(ticker.getTicker())
                    .quantity(pt.getNumber())
                    .companyName(ticker.getName())
                    .averageCost(pt.getAveragePrice())
                    .equity(pt.getTicker().getEquity())
                    .build());
        }

        return PortfolioDto.PerformanceResponseDto.builder()
                .initialAsset(portfolio.getInitAsset())
                .currentCash(portfolio.getCurrentCash())
                .portfolioPerformances(portfolioPerformances)
                .build();
    }

    @Transactional
    public void buyStock(Integer pfId, PortfolioDto.BuyRequestDto buyRequestDto) {
        // TODO: 평단가 업데이트, 현재 현금으로 매수 가능 여부
        Portfolio portfolio = portfolioRepository.getReferenceById(pfId);
        List<PortfolioTicker> portfolioTickers = portfolio.getPortfolioTickers();

        // 이미 보유한 종목일 시
        for (PortfolioTicker portfolioTicker : portfolioTickers) {
            if (portfolioTicker.getTicker().getTicker().equals(buyRequestDto.getTicker())) {
                // 현재 수량 계산
                int existingQuantity = portfolioTicker.getNumber();
                int newQuantity = existingQuantity + buyRequestDto.getQuantity();
                portfolioTicker.updateNumber(newQuantity);
                portfolioTickerRepository.save(portfolioTicker);

                // 총 매수 비용 계산
                float totalCost = buyRequestDto.getQuantity() * buyRequestDto.getPrice();
                float newCurrentCash = portfolio.getCurrentCash() - totalCost;
                portfolio.updateCurrentCash(newCurrentCash);
                portfolioRepository.save(portfolio);
                return;
            }
        }

        // 새로운 종목일 시
        PortfolioTicker portfolioTicker = portfolioTickerRepository.save(PortfolioTicker.builder()
                .ticker(tickerRepository.findById(buyRequestDto.getTicker()).get())
                .portfolio(portfolio)
                .averagePrice(buyRequestDto.getPrice())
                .number(buyRequestDto.getQuantity())
                .build());
        portfolio.getPortfolioTickers().add(portfolioTicker);

        float totalCost = buyRequestDto.getQuantity() * buyRequestDto.getPrice();
        float newCurrentCash = portfolio.getCurrentCash() - totalCost;
        portfolio.updateCurrentCash(newCurrentCash);
        portfolioRepository.save(portfolio);
    }

    public void sellStock(Integer pfId, PortfolioDto.sellRequestDto sellRequestDto) {
        PortfolioTicker portfolioTicker = findPortfolioTicker(pfId, sellRequestDto.getTicker());
        Portfolio portfolio = portfolioTicker.getPortfolio();

        // TODO: 매도 가능 여부(해당 티커 보유 중인지, 매도량 < 보유량인지)
        int existingQuantity = portfolioTicker.getNumber();
        int newQuantity = existingQuantity - sellRequestDto.getQuantity();

        float totalCost = sellRequestDto.getQuantity() * sellRequestDto.getPrice();

        float newCurrentCash = portfolio.getCurrentCash() + totalCost;
        portfolio.updateCurrentCash(newCurrentCash);

        portfolioTicker.updateNumber(newQuantity);
        portfolio.updateCurrentCash(newCurrentCash);

        portfolioTickerRepository.save(portfolioTicker);
        portfolioRepository.save(portfolio);
    }

    public PortfolioTicker findPortfolioTicker(Integer portfolioId, String tickerId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
        Ticker ticker = tickerRepository.findById(tickerId)
                .orElseThrow(() -> new IllegalArgumentException("Ticker not found"));

        return portfolioTickerRepository.findByPortfolioAndTicker(portfolio, ticker)
                .orElseThrow(() -> new IllegalArgumentException("PortfolioTicker not found"));
    }
}

