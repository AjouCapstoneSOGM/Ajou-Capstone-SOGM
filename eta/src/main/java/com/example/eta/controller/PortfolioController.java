package com.example.eta.controller;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.User;
import com.example.eta.service.PortfolioService;
import com.example.eta.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("api/portfolio")
public class PortfolioController {

    private final UserService userService;
    private final PortfolioService portfolioService;

    @PostMapping("/create/auto")
    public ResponseEntity<Map<String, Integer>> createAutoPortfolio(@RequestBody PortfolioDto.CreateRequestDto createRequestDto,
                                                                    @AuthenticationPrincipal String email) throws Exception {
        // 유저 정보 가져오기
        User user = userService.findByEmail(email);

        // DB에 포트폴리오 생성
        Portfolio portfolio = portfolioService.createInitAutoPortfolio(user, createRequestDto);

        // FastAPI 서버로부터 포트폴리오 결과 받아오고 초기화
        portfolioService.initializeAutoPortfolio(portfolio, createRequestDto);

        Map<String, Integer> responseData = new HashMap<>();
        responseData.put("pfId", portfolio.getPfId());

        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/{port_id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable("port_id") Integer pfId) {
        portfolioService.deletePortfolio(pfId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{port_id}/performance")
    public ResponseEntity<PortfolioDto.PerformanceResponseDto> getPortfolioPerformance(@PathVariable("port_id") Integer pfId, @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(portfolioService.getPerformanceData(pfId));
    }

    @PostMapping("/{port_id}/buy")
    public ResponseEntity<Void> buyStock(@PathVariable("port_id") Integer pfId, @RequestBody PortfolioDto.BuyRequestDto buyRequestDto) {
        portfolioService.buyStock(pfId, buyRequestDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{port_id}/sell")
    public ResponseEntity<Void> sellStock(@PathVariable("port_id") Integer pfId, @RequestBody PortfolioDto.sellRequestDto sellRequestDto) {
        portfolioService.sellStock(pfId, sellRequestDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<PortfolioDto.PortfolioInfoListDto> getPortfolioInfos(@AuthenticationPrincipal String email) {
        User user = userService.findByEmail(email);

        List<PortfolioDto.PortfolioInfo> portfolioInfos = new ArrayList<>();
        for (Portfolio portfolio : user.getPortfolios()) {
            PortfolioDto.PortfolioInfo portfolioInfo = PortfolioDto.PortfolioInfo.builder()
                    .id(portfolio.getPfId())
                    .name(portfolio.getName())
                    .isAuto(portfolio.getIsAuto())
                    .country(portfolio.getCountry())
                    .riskValue(portfolio.getRiskValue())
                    .createdDate(portfolio.getCreatedDate())
                    .build();
            portfolioInfos.add(portfolioInfo);
        }
        PortfolioDto.PortfolioInfoListDto responseData = PortfolioDto.PortfolioInfoListDto.builder()
                .count(portfolioInfos.size())
                .portfolios(portfolioInfos)
                .build();
        return ResponseEntity.ok(responseData);
    }
}
