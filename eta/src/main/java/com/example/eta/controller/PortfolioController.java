package com.example.eta.controller;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.User;
import com.example.eta.service.PortfolioService;
import com.example.eta.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/portfolio")
public class PortfolioController {

    private final UserService userService;
    private final PortfolioService portfolioService;

    @PostMapping("/create/auto")
    public ResponseEntity<Object> createAutoPortfolio(@RequestBody PortfolioDto.CreateRequestDto createRequestDto,
                                                      @AuthenticationPrincipal String email) throws InterruptedException{
        // 유저 정보 가져오기
        User user = userService.findByEmail(email);

        // DB에 포트폴리오 생성
        Portfolio portfolio = portfolioService.createInitAutoPortfolio(user, createRequestDto);

        // FastAPI 서버로부터 포트폴리오 결과 받아오기
        portfolioService.retrieveCreatedPortfolioAndSetRebalancing(portfolio, createRequestDto);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
