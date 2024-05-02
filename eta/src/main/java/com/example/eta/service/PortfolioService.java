package com.example.eta.service;

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

    private final UserRepository userRepository;

    private final PortfolioRepository portfolioRepository;

    private final SectorRepository sectorRepository;

    private final PortfolioSectorRepository portfolioSectorRepository;

    private final TickerRepository tickerRepository;

    private final RebalancingRepository rebalancingRepository;

    private final RebalancingTickerRepository rebalancingTickerRepository;

    @Transactional
    public Portfolio createInitAutoPortfolio(User user, PortfolioDto.CreateRequestDto createRequestDto) {
        Portfolio portfolio = new Portfolio().builder()
                .user(user)
                .country(createRequestDto.getCountry())
                .isAuto(true)
                .initAsset(createRequestDto.getAsset())
                .initCash(createRequestDto.getAsset())
                .currentCash(createRequestDto.getAsset())
                .riskValue(createRequestDto.getRiskValue())
                .build();
        portfolioRepository.save(portfolio);

        List<Sector> sectors = sectorRepository.findAllById(createRequestDto.getSector());
        for(Sector sector : sectors) {
            PortfolioSector portfolioSector = new PortfolioSector().builder()
                    .portfolio(portfolio)
                    .sector(sector)
                    .build();
            portfolioSectorRepository.save(portfolioSector);
        }

        return portfolio;
    }

    @Transactional
    public void getAutoPortfolioCreationAndSet(Portfolio portfolio, PortfolioDto.CreateRequestDto createRequestDto) throws Exception{
        List<Ticker> tickers = tickerRepository.findTopTickerBySector(createRequestDto.getSector().get(0), 10, createRequestDto.getCountry());

        List<String> postfixedTickers = new ArrayList<>();
        for(Ticker ticker : tickers) {
            if (ticker.getExchange().equals("KOSPI")) {
                postfixedTickers.add(ticker.getTicker() + ".KS");
            }
            else if(ticker.getExchange().equals("KOSDAQ")) {
                postfixedTickers.add(ticker.getTicker() + ".KQ");
            }
        }

        PortfolioDto.CreateRequestToFastApiDto createRequestToFastApiDto = PortfolioDto.CreateRequestToFastApiDto.builder()
                .tickers(postfixedTickers)
                .safe_asset_ratio(
                        createRequestDto.getRiskValue() == 1 ? 0.1f :
                        createRequestDto.getRiskValue() == 2 ? 0.2f : 0.3f
                )
                .initial_cash((int)createRequestDto.getAsset())
                .build();

        // TODO: FastAPI 서버로부터 포트폴리오 정보 받아오기
        // PortfolioDto.CreatedResultFromFastApiDto createdResultFromFastApiDto = new PortfolioDto.CreatedResultFromFastApiDto();
        // List<Integer> stockNumPerTicker = createdResultFromFastApiDto.getInit_asset_num();
        List<Integer> stockNumPerTicker = new ArrayList<>(List.of(3, 3, 3, 3, 3, 2, 2, 2, 2, 2));

        Rebalancing rebalancing = Rebalancing.builder()
                .portfolio(portfolio)
                .createdDate(LocalDateTime.now())
                .build();
        rebalancingRepository.save(rebalancing);

        // TODO: 예외 타입 지정
        if (tickers.size() != stockNumPerTicker.size()) {
            throw new Exception();
        }

        for (int i=0;i<tickers.size();i++) {
            RebalancingTicker rebalancingTicker = rebalancingTickerRepository.save(RebalancingTicker.builder()
                    .rebalancing(rebalancing)
                    .ticker(tickers.get(i))
                    .isBuy(true)
                    .number(stockNumPerTicker.get(i))
                    .build());
            rebalancing.getRebalancingTickers().add(rebalancingTicker);
        }

        portfolio.setCreatedDate(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }

    public Map<String, Object> getPerformanceDataV1(Integer pfId) throws IllegalAccessException {
        Portfolio portfolio = portfolioRepository.findById(pfId)
                .orElseThrow(() -> new IllegalAccessException("Portfolio not found with id: " + pfId));

        // PortfolioTicker 리스트를 가져오기
        List<PortfolioTicker> portfolioTickers = portfolio.getPortfolioTickers();
        List<PortfolioDto.PerformanceResponseDto> tickerPerformances = new ArrayList<>();

        for (PortfolioTicker pt : portfolioTickers) {
            Ticker ticker = pt.getTicker();
            float averagePrice = pt.getAveragePrice();

            PortfolioDto.PerformanceResponseDto responseDto = new PortfolioDto.PerformanceResponseDto(
                    pt.getNumber(),
                    averagePrice,
                    ticker.getTicker(),
                    ticker.getName());

            tickerPerformances.add(responseDto);
        }

        float currentCash = portfolio.getCurrentCash();

        Map<String, Object> performance = new HashMap<>();

        performance.put("portfolioPerformance", tickerPerformances);
        performance.put("currentCash", currentCash);

        return performance;
    }
}
