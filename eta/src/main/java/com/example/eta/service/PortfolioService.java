package com.example.eta.service;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final UserRepository userRepository;

    private final PortfolioRepository portfolioRepository;

    public Portfolio createInitAutoPortfolio(String email, PortfolioDto.CreateRequestDto createRequestDto) {
        Portfolio portfolio = new Portfolio().builder()
                .user(userRepository.findByEmail(email).get())
                .country(createRequestDto.getCountry())
                .isAuto(true)
                .initAsset(createRequestDto.getAsset())
                .initCash(createRequestDto.getAsset())
                .currentCash(createRequestDto.getAsset())
                .riskValue(createRequestDto.getRiskValue())
                .build();
        portfolioRepository.save(portfolio);
        return portfolio;
    }
}
