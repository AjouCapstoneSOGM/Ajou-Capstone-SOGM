package com.example.eta.controller;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.entity.User;
import com.example.eta.service.PortfolioService;
import com.example.eta.service.RebalancingService;
import com.example.eta.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final RebalancingService rebalancingService;

    @PostMapping("/create/auto")
    public ResponseEntity<Map<String, Integer>> createAutoPortfolio(@RequestBody PortfolioDto.CreateRequestDto createRequestDto,
                                                      @AuthenticationPrincipal String email) throws Exception{
        // 유저 정보 가져오기
        User user = userService.findByEmail(email);

        // DB에 포트폴리오 생성
        Portfolio portfolio = portfolioService.createInitAutoPortfolio(user, createRequestDto);

        // FastAPI 서버로부터 포트폴리오 결과 받아오고 초기화
        portfolioService.initializeAutoPortfolio(portfolio, createRequestDto);

        Map<String, Integer> responseData = new HashMap<>();
        responseData.put("pfId", portfolio.getPfId());

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @DeleteMapping("/{port_id}")
    public ResponseEntity<?> deletePortfolio(@PathVariable("port_id") Integer pfId) {
        try {
            portfolioService.deletePortfolio(pfId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting portfolio: " + e.getMessage());
        }
    }

    @GetMapping("/{port_id}/performance")
    public ResponseEntity<PortfolioDto.PerformanceResponseDto> getPortfolioPerformance(@PathVariable("port_id") Integer pfId, @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(portfolioService.getPerformanceData(pfId));
    }
  
    @PostMapping("/{port_id}/buy")
    public ResponseEntity<String> buyStock(@PathVariable("port_id") Integer pfId, @RequestBody PortfolioDto.BuyRequestDto buyRequestDto) {
        try {
            portfolioService.buyStock(pfId, buyRequestDto);
            return ResponseEntity.ok("매수 내용이 성공적으로 기록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("요청이 유효하지 않습니다: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("매수 기록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/{port_id}/sell")
    public ResponseEntity<String> sellStock(@PathVariable("port_id") Integer pfId, @RequestBody PortfolioDto.sellRequestDto sellRequestDto) {
        try {
            portfolioService.sellStock(pfId, sellRequestDto);
            return ResponseEntity.ok("매수 내용이 성공적으로 기록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("요청이 유효하지 않습니다: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("매수 기록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<PortfolioDto.PortfolioInfoListDto> getPortfolioInfos(@AuthenticationPrincipal String email) throws InterruptedException {
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
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // 포트폴리오 리밸런싱 알림 존재여부 확인
    @GetMapping("/rebalancing/{port_id}/exists")
    public ResponseEntity<Boolean> checkRebalancingExists(@PathVariable("port_id") Integer pfId) {
        boolean exists = rebalancingService.existsRebalancingByPortfolioId(pfId);
        return ResponseEntity.ok(exists);
    }

    // 모든 리밸런싱 알림 받아오기
    @GetMapping("/rebalancing/{port_id}")
    public ResponseEntity<List<RebalancingTicker>> getAllRebalancing(@PathVariable("port_id") Integer pfId) {
        List<RebalancingTicker> rebalancingTickers = rebalancingService.findAllRebalancingByPortfolioId(pfId);
        return ResponseEntity.ok(rebalancingTickers);
    }

    @DeleteMapping("/api/portfolio/rebalancing/{rn_id}")
    public ResponseEntity<?> deleteRebalancing(@PathVariable("rn_id") Integer rnId) {
        try {
            rebalancingService.deleteRebalancing(rnId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting rebalancing notification: " + e.getMessage());
        }
    }

}
