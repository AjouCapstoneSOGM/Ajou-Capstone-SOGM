package com.example.adminpage.service;

import com.example.adminpage.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;
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
}
