package com.example.adminpage.service;

import com.example.adminpage.entity.Portfolio;
import com.example.adminpage.entity.PortfolioTicker;
import com.example.adminpage.repository.PortfolioRepository;
import com.example.adminpage.repository.PortfolioSectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;
    @Autowired
    private PortfolioSectorRepository portfolioSectorRepository;

    public Map<Integer, Long> getPortfoliosCountByRiskValue() {
        List<Object[]> results = portfolioRepository.countPortfoliosByRiskValue();
        Map<Integer, Long> portfoliosCountByRiskValue = new HashMap<>();
        for (Object[] result : results) {
            Integer riskValue = (Integer) result[0];
            Long count = (Long) result[1];
            portfoliosCountByRiskValue.put(riskValue, count);
        }
        return portfoliosCountByRiskValue;
    }

    public Map<Integer, Double> calculateReturnRates() {
        List<Portfolio> portfolios = portfolioRepository.findAllAuto();
        Map<Integer, Double> returnRates = new HashMap<>();

        for (Portfolio portfolio : portfolios) {
            double initialAsset = portfolio.getInitAsset();
            double currentCash = portfolio.getCurrentCash();
            double currentValue = currentCash;

            for (PortfolioTicker ticker : portfolio.getPortfolioTickers()) {
                double tickerValue = ticker.getNumber() * ticker.getAveragePrice();
                currentValue += tickerValue;
            }

            double returnRate = (currentValue - initialAsset) / initialAsset * 100;
            returnRates.put(portfolio.getPfId(), returnRate);
        }

        return returnRates;
    }
    public double calculateAverageReturnRate() {
        Map<Integer, Double> returnRates = calculateReturnRates();
        double totalReturnRate = 0.0;
        for (double rate : returnRates.values()) {
            totalReturnRate += rate;
        }
        return totalReturnRate / returnRates.size();
    }
    public Map<String, Integer> compareReturnRatesWithDepositRate(double depositRate) {
        Map<Integer, Double> returnRates = calculateReturnRates();
        int higherCount = 0;
        int lowerCount = 0;

        for (double rate : returnRates.values()) {
            if (rate > depositRate) {
                higherCount++;
            } else {
                lowerCount++;
            }
        }

        Map<String, Integer> comparisonResults = new HashMap<>();
        comparisonResults.put("higherCount", higherCount);
        comparisonResults.put("lowerCount", lowerCount);

        return comparisonResults;
    }

    public List<Map<String, Object>> getSectorReturnRates() {
        List<Object[]> results = portfolioSectorRepository.findSectorReturnRates();
        List<Map<String, Object>> sectorReturnRates = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> rate = new HashMap<>();
            rate.put("sectorName", result[0]);
            rate.put("averageReturnRate", (Double) result[1]);
            sectorReturnRates.add(rate);
        }

        return sectorReturnRates;
    }

    public List<Map<String, Object>> getRiskPortfolioReturns(){
        List<Object[]> results = portfolioSectorRepository.findRiskReturnRates();
        List<Map<String, Object>> riskReturnRates = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> rate = new HashMap<>();
            rate.put("risk", result[0]);
            rate.put("averageReturnRate", result[1]);
            riskReturnRates.add(rate);
        }
        return riskReturnRates;
    }
}
