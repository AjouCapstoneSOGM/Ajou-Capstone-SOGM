package com.example.eta.service;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final UserRepository userRepository;

    private final PortfolioRepository portfolioRepository;

    @Transactional
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

    @Async
    @Transactional
    public void retrieveCreatedPortfolioAndSetRebalancing(Portfolio portfolio, PortfolioDto.CreateRequestDto createRequestDto) throws InterruptedException{
        // TODO: FastAPI 서버로부터 포트폴리오 정보 받아오기
        Thread.sleep(3000L);

        // TODO: 받아온 포트폴리오 리밸런싱 알림 업데이트
        // created_time 현재시간으로 업데이트
        portfolio.setCreatedDate(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }
}
