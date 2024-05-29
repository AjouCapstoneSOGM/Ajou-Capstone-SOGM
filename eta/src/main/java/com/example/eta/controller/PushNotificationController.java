package com.example.eta.controller;

import com.example.eta.dto.PushMessageDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.RebalancingRepository;
import com.example.eta.scheduler.PortfolioScheduler;
import com.example.eta.scheduler.PushNotificationService;
import com.example.eta.service.PortfolioService;
import com.example.eta.service.RebalancingService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

/**
 * 푸시 알림 동작 확인을 위한 임시 컨트롤러
 *
 */
@RestController
@AllArgsConstructor
@RequestMapping("api/push")
public class PushNotificationController {

    private final PortfolioScheduler portfolioScheduler;
    private final PushNotificationService pushNotificationService;
    private final PortfolioRepository portfolioRepository;
    private final RebalancingRepository rebalancingRepository;

    @PostMapping("/send/{pf_id}/{rn_id}")
    public ResponseEntity<Void> sendPushNotification(@PathVariable("pf_id") Integer pfId, @PathVariable("rn_id") Integer rnId, @RequestBody Map<String, String> tokenMap){
        Portfolio portfolio = portfolioRepository.getReferenceById(pfId);
        portfolioScheduler.sendRebalancingPushNotification(tokenMap.get("to"), portfolio, rnId);
        return ResponseEntity.ok().build();
    }
}
