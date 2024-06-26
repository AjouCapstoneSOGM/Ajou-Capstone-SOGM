package com.example.eta.service;

import com.example.eta.api.ApiClientFastApi;
import com.example.eta.dto.PortfolioDto;
import com.example.eta.dto.TickerDto;
import com.example.eta.entity.*;
import com.example.eta.exception.portfolio.CannotSellStockException;
import com.example.eta.exception.portfolio.NotEnoughCashException;
import com.example.eta.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
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
    private final PortfolioRecordRepository portfolioRecordRepository;
    private final PriceRepository priceRepository;
    private final ApiClientFastApi apiClientFastApi;

    /**
     * 포트폴리오의 종목별 자산량을 계산하고, 포트폴리오의 총자산(현금+보유종목)을 반환합니다.
     *
     * <p> {@code averagePriceUpdated} 가 {@code true}이면 평단가를 기준으로 자산량을 계산하고, {@code false}이면 가장 최근의 종가를 기준으로 자산량을 계산힙니다.
     *
     * <p> {@code currentAmountForTicker}에 종목별 자산량이 담깁니다. 종목별 자산량이 필요하지 않은 경우 {@code null}을 전달합니다.
     */
    public float calculateAmount(Portfolio portfolio, boolean averagePriceUpdated, Map<PortfolioTicker, Float> currentAmountForTicker) {
        float totalAmount = portfolio.getCurrentCash();
        for (PortfolioTicker portfolioTicker : portfolio.getPortfolioTickers()) {
            float number = portfolioTicker.getNumber();
            float price = averagePriceUpdated ? portfolioTicker.getAveragePrice() :
                    priceRepository.findLatestPriceByTicker(portfolioTicker.getTicker().getTicker())
                            .get().getClose().floatValue();
            totalAmount += price * number;
            if (currentAmountForTicker != null)
                currentAmountForTicker.put(portfolioTicker, price * number);
        }
        return totalAmount;
    }

    /**
     * 포트폴리오의 현재 비중을 업데이트힙니다. 종목의 종가를 기준으로 계산합니다.
     *
     * <p> {@code setInitProportion} 가 {@code true}이면 초기 비중을 현재 비중과 동일하게 설정합니다.
     *
     * <p> 종목의 종가를 기준으로 계산하는 이유는 기본적으로 현재 비중 정보는 비중 리밸런싱을 위해 필요하기 때문이며, 따라서 이 메서드는 비중 리밸런싱 시에 사용된다.
     * 그러나 현재 코드상으로 수동 포트폴리오에서 초기 비중을 현재 비중으로 업데이트하기 위해 이 메서드를 사용해주고 있는데, 사실 이 경우는 전날 종가가 아닌 현재가를 기준으로 계산하는게 엄밀히 정확하다.
     * 일단 치명적으로 잘못된 부분은 아니지만, 추후 수정이 필요할 수 있다.
     */
    @Transactional
    public void updatePortfolioProportion(Portfolio portfolio, boolean setInitProportion) {
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();
        float totalAmount = calculateAmount(portfolio, false, currentAmountForTicker);

        for (PortfolioTicker portfolioTicker : currentAmountForTicker.keySet()) {
            float currentProportion = currentAmountForTicker.get(portfolioTicker).floatValue() / totalAmount;
            portfolioTicker.setCurrentProportion(currentProportion);
            if (setInitProportion) {
                portfolioTicker.setInitProportion(currentProportion);
            }
            portfolioTickerRepository.save(portfolioTicker);
        }
    }

    /**
     * 포트폴리오의 초기 비중과 현재 비중을 평단가를 기준으로 계산하여 설정합니다.
     *
     * <p> 자동, 수동 포트폴리오 생성 시 최초 비중을 설정하기 위해 사용합니다.
     */
    @Transactional
    public void setPortfolioInitProportion(Portfolio portfolio) {
        Map<PortfolioTicker, Float> currentAmountForTicker = new HashMap<>();
        float totalAmount = calculateAmount(portfolio, true, currentAmountForTicker);

        for (PortfolioTicker portfolioTicker : currentAmountForTicker.keySet()) {
            float currentProportion = currentAmountForTicker.get(portfolioTicker).floatValue() / totalAmount;
            portfolioTicker.setInitProportion(currentProportion);
            portfolioTicker.setCurrentProportion(currentProportion);
            portfolioTickerRepository.save(portfolioTicker);
        }
    }


    @Transactional
    public Portfolio createInitAutoPortfolio(User user, PortfolioDto.CreateRequestDto createRequestDto) {
        String name = createRequestDto.getName();
        if (name == null) {
            name = user.getName() + "의 자동 포트폴리오 " + (user.getPortfolios().size() + 1);
        }

        Portfolio portfolio = new Portfolio().builder()
                .user(user)
                .name(name)
                .country(createRequestDto.getCountry())
                .isAuto(true)
                .initAsset(createRequestDto.getAsset())
                .initCash(createRequestDto.getAsset())
                .currentCash(createRequestDto.getAsset())
                .riskValue(createRequestDto.getRiskValue())
                .build();
        portfolioRepository.save(portfolio);
        user.getPortfolios().add(portfolio);

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

        PortfolioDto.CreatedResultFromFastApiDto createdResultFromFastApiDto = apiClientFastApi.getCreatedPortfolioApi(PortfolioDto.CreateRequestToFastApiDto.builder()
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

        List<TickerDto.TickerPrice> tickerPrices = apiClientFastApi.getCurrentTickerPrice(tickers.stream().map(Ticker::getTicker).toList()).block().getBody().getPrices();

        for (int i = 0; i < tickers.size(); i++) {
            RebalancingTicker rebalancingTicker = rebalancingTickerRepository.save(RebalancingTicker.builder()
                    .rebalancing(rebalancing)
                    .ticker(tickers.get(i))
                    .isBuy(true)
                    .number(stockNumPerTicker.get(i))
                    .price(tickerPrices.get(i).getCurrent_price())
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

        portfolioRepository.save(portfolio);
    }

    public String getPortfolioNameById(Integer pfId) {
        return portfolioRepository.findById(pfId).get().getName();
    }

    public void deletePortfolio(Integer pfId) {
        portfolioRepository.deleteById(pfId);
    }

    public PortfolioDto.PerformanceResponseDto getPerformanceData(Integer pfId) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();

        List<PortfolioDto.PortfolioPerformanceDto> portfolioPerformances = new ArrayList<>();
        for (PortfolioTicker pt : portfolio.getPortfolioTickers()) {
            Ticker ticker = pt.getTicker();
            portfolioPerformances.add(PortfolioDto.PortfolioPerformanceDto.builder()
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
    public int createManualPortfolio(User user,PortfolioDto.CreateManualRequestDto request) {
        String name = request.getName();
        if (name == null) {
            name = user.getName() + "의 수동 포트폴리오 " + (user.getPortfolios().size() + 1);
        }

        float totalAsset = request.getCash();
        for (PortfolioDto.StockDetailDto stock : request.getStocks()) {
            totalAsset = totalAsset + (stock.getQuantity() * stock.getPrice());
        }

        // 포트폴리오 생성
        Portfolio portfolio = new Portfolio().builder()
                .user(user)
                .name(name)
                .createdDate(LocalDateTime.now())
                .country(request.getCountry())
                .isAuto(false)
                .initAsset(totalAsset)
                .initCash(request.getCash())
                .currentCash(request.getCash())
                .build();
        portfolioRepository.save(portfolio);


        // 주식 추가
        for (PortfolioDto.StockDetailDto stock : request.getStocks()) {
            Ticker ticker = tickerRepository.findByTicker(stock.getTicker());
            PortfolioTicker portfolioTicker = portfolioTickerRepository.save(PortfolioTicker.builder()
                    .portfolio(portfolio)
                    .ticker(ticker)
                    .number(stock.getQuantity())
                    .averagePrice(stock.getPrice())
                    .build());
            portfolio.getPortfolioTickers().add(portfolioTicker);

            //변동 기록 저장
            portfolioRecordRepository.save(PortfolioRecord.builder()
                    .portfolio(portfolio)
                    .ticker(ticker)
                    .number(stock.getQuantity())
                    .price(stock.getPrice())
                    .isBuy(stock.getIsBuy())
                    .recordDate(LocalDateTime.now())
                    .build());
        }

        // 초기 비중, 현재 비중 업데이트
        setPortfolioInitProportion(portfolio);

        return portfolio.getPfId();
    }

    @Transactional
    public void buyStock(Integer pfId, PortfolioDto.BuyRequestDto buyRequestDto) {
        Portfolio portfolio = portfolioRepository.getReferenceById(pfId);
        List<PortfolioTicker> portfolioTickers = portfolio.getPortfolioTickers();
        Ticker ticker = tickerRepository.findById(buyRequestDto.getTicker()).get();

        if (portfolio.getCurrentCash() < buyRequestDto.getPrice() * buyRequestDto.getQuantity()) {
            throw new NotEnoughCashException();
        }

        // 이미 보유한 종목일 시 보유 종목 정보 업데이트, 아닐 시 새로운 종목 추가
        portfolioTickers.stream().filter(pt -> pt.getTicker().equals(ticker)).findFirst().ifPresentOrElse(
            pt -> {
                int existingQuantity = pt.getNumber();
                pt.updateNumber(existingQuantity + buyRequestDto.getQuantity());
                pt.setAveragePrice(((pt.getAveragePrice() * existingQuantity) + (buyRequestDto.getPrice() * buyRequestDto.getQuantity())) / (existingQuantity + buyRequestDto.getQuantity()));
                portfolioTickerRepository.save(pt);
            },
            () -> {
                PortfolioTicker portfolioTicker = portfolioTickerRepository.save(PortfolioTicker.builder()
                        .ticker(tickerRepository.findById(buyRequestDto.getTicker()).get())
                        .portfolio(portfolio)
                        .averagePrice(buyRequestDto.getPrice())
                        .number(buyRequestDto.getQuantity())
                        .build());
                portfolio.getPortfolioTickers().add(portfolioTicker);
            }
        );

        portfolioRecordRepository.save(PortfolioRecord.builder()
                .portfolio(portfolio)
                .ticker(ticker)
                .number(buyRequestDto.getQuantity())
                .price(buyRequestDto.getPrice())
                .isBuy(buyRequestDto.getIsBuy())
                .recordDate(LocalDateTime.now())
                .build());

        // 포트폴리오 초기 자산 업데이트, 현금 업데이트
        float asset = calculateAmount(portfolio, true, null);
        portfolio.setInitAsset(asset);
        portfolio.updateCurrentCash(portfolio.getCurrentCash() - buyRequestDto.getPrice() * buyRequestDto.getQuantity());

        // 초기, 현재 비중 업데이트
        updatePortfolioProportion(portfolio, true);

        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void sellStock(Integer pfId, PortfolioDto.SellRequestDto sellRequestDto) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();
        Ticker ticker = tickerRepository.findById(sellRequestDto.getTicker()).get();
        PortfolioTicker portfolioTicker = portfolioTickerRepository.findByPortfolioAndTicker(portfolio, ticker).orElseThrow(
                () -> new CannotSellStockException());

        // 매도 가능 여부 확인
        int existingQuantity = portfolioTicker.getNumber();
        int sellQuantity = sellRequestDto.getQuantity();
        if (existingQuantity < sellQuantity) {
            throw new CannotSellStockException();
        }

        int newQuantity = existingQuantity - sellRequestDto.getQuantity();
        portfolioTicker.updateNumber(newQuantity);

        portfolioRecordRepository.save(PortfolioRecord.builder()
                .portfolio(portfolio)
                .ticker(portfolioTicker.getTicker())
                .number(sellRequestDto.getQuantity())
                .price(sellRequestDto.getPrice())
                .isBuy(sellRequestDto.getIsBuy())
                .recordDate(LocalDateTime.now())
                .build());

        if (newQuantity == 0) {
            portfolioTickerRepository.delete(portfolioTicker);
            portfolio.getPortfolioTickers().remove(portfolioTicker);
        } else {
            portfolioTickerRepository.save(portfolioTicker);
        }

        // 포트폴리오 초기 자산, 현금 업데이트
        float asset = calculateAmount(portfolio, true, null);
        portfolio.setInitAsset(asset);
        portfolio.updateCurrentCash(portfolio.getCurrentCash() + sellRequestDto.getPrice() * sellRequestDto.getQuantity());

        // 초기, 현재 비중 업데이트
        updatePortfolioProportion(portfolio, true);

        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void depositCash(Integer pfId, float cash) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();
        portfolio.updateCurrentCash(portfolio.getCurrentCash() + cash);

        // 현재 비중 업데이트 (수동일 경우, 초기 비중도 업데이트)
        updatePortfolioProportion(portfolio, !portfolio.getIsAuto());

        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void withdrawCash(Integer pfId, float cash) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();
        if (portfolio.getCurrentCash() < cash) {
            throw new NotEnoughCashException();
        }
        portfolio.updateCurrentCash(portfolio.getCurrentCash() - cash);

        // 현재 비중 업데이트 (수동일 경우, 초기 비중도 업데이트)
        updatePortfolioProportion(portfolio, !portfolio.getIsAuto());

        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void updatePortfolioName(Integer pfId, String newName) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();
        portfolio.setName(newName);
        portfolioRepository.save(portfolio);
    }

    public Portfolio findOne(Integer pfId) {
        return portfolioRepository.findById(pfId).get();
    }
}

