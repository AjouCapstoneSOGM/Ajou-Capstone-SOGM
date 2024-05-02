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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/{port_id}/performance")
    public ResponseEntity<?> getPortfolioPerformance(@PathVariable("port_id") Integer pfId) {
        try {
            Map<String, Object> performanceData = portfolioService.getPerformanceDataV1(pfId);
            return ResponseEntity.ok(performanceData);
        } catch (IllegalAccessException e) {
            // This is the case where the portfolio ID does not belong to the user.
            // The exact exception type and handling might differ based on your service logic.
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access is denied for the given portfolio ID.");
        } catch (Exception e) {
            // Generic exception handling, ideally you'll have more specific handlers.
            return ResponseEntity.internalServerError().body("An error occurred while processing your request.");
        }
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
}
