package com.example.eta.service;

import com.example.eta.api.ApiClient;
import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.*;
import com.example.eta.entity.compositekey.PortfolioTickerId;
import com.example.eta.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
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

    private final ApiClient apiClient;

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

        for(Sector sector : sectorRepository.findAllById(createRequestDto.getSector())) {
            PortfolioSector portfolioSector = new PortfolioSector().builder()
                    .portfolio(portfolio)
                    .sector(sector)
                    .build();
            portfolioSectorRepository.save(portfolioSector);
        }

        return portfolio;
    }

    @Transactional
    public void initializeAutoPortfolio(Portfolio portfolio, PortfolioDto.CreateRequestDto createRequestDto) throws Exception{
        List<Ticker> tickers = tickerRepository.findTopTickerBySector(createRequestDto.getSector().get(0), 10, createRequestDto.getCountry());
        List<Integer> stockNumPerTicker = getCreatedResultFromFastAPI(createRequestDto, tickers);
        setInitAutoPortfolio(portfolio, tickers, stockNumPerTicker);
    }

    public List<Integer> getCreatedResultFromFastAPI(PortfolioDto.CreateRequestDto createRequestDto, List<Ticker> tickers) throws Exception{
        List<String> postfixedTickers = new ArrayList<>();
        for(Ticker ticker : tickers) {
            if (ticker.getExchange().equals("KOSPI")) {
                postfixedTickers.add(ticker.getTicker() + ".KS");
            }
            else if(ticker.getExchange().equals("KOSDAQ")) {
                postfixedTickers.add(ticker.getTicker() + ".KQ");
            }
        }

        PortfolioDto.CreatedResultFromFastApiDto createdResultFromFastApiDto = apiClient.getCreatedPortfolioApi(PortfolioDto.CreateRequestToFastApiDto.builder()
                .tickers(postfixedTickers)
                .safe_asset_ratio(
                    createRequestDto.getRiskValue() == 1 ? 0.1f :
                    createRequestDto.getRiskValue() == 2 ? 0.2f : 0.3f
                )
                .initial_cash((int)createRequestDto.getAsset())
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

        for (int i=0;i<tickers.size();i++) {
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

        portfolio.setCreatedDate(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }
    public void deletePortfolio(Integer pfId) throws Exception {
        // 포트폴리오 존재 여부 확인
        if (!portfolioRepository.existsById(pfId)) {
            throw new Exception("Portfolio not found with id: " + pfId);
        }
        // 포트폴리오 삭제
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
        // 포트폴리오티커 조회 다대다 관계 문제로 findPortfolioTicker 정의
        // 포트폴리오티커,포트폴리오 조회
        PortfolioTicker portfolioTicker = findPortfolioTicker(pfId, buyRequestDto.getTicker());
        Portfolio portfolio = portfolioTicker.getPortfolio();

        // 현재 수량 계산
        int existingQuantity = portfolioTicker.getNumber();
        int newQuantity = existingQuantity + buyRequestDto.getQuantity();
        portfolioTicker.updateNumber(newQuantity);

        // 총 매수 비용 계산
        float totalCost = buyRequestDto.getQuantity() * buyRequestDto.getPrice();

        // 포트폴리오의 현재 현금 업데이트
        float newCurrentCash = portfolio.getCurrentCash() - totalCost;
        portfolio.updateCurrentCash(newCurrentCash);

        // 엔티티 저장
        portfolioTickerRepository.save(portfolioTicker);
        portfolioRepository.save(portfolio); // 변경된 포트폴리오 저장
    }

    public void sellStock(Integer pfId, PortfolioDto.sellRequestDto sellRequestDto) {
        PortfolioTicker portfolioTicker = findPortfolioTicker(pfId, sellRequestDto.getTicker());
        Portfolio portfolio = portfolioTicker.getPortfolio();

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

