package com.example.eta.service;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;
    @Autowired
    private UserRepository userRepository;
    public Portfolio createPortfolio(Long userId, PortfolioDto portfolioDto) {
        Portfolio portfolio = new Portfolio();
        portfolio.setUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
        portfolio.setInitAsset(portfolioDto.getInitAsset());
        portfolio.setIsAuto(portfolioDto.getIsAuto());
        portfolio.setRiskValue(portfolioDto.getRiskValue());
        portfolio.setInterestArea(portfolioDto.getInterestArea());
        return portfolioRepository.save(portfolio);
    }
}
