package com.example.eta.controller;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.User;
import com.example.eta.scheduler.PortfolioScheduler;
import com.example.eta.service.PortfolioService;
import com.example.eta.service.RebalancingService;
import com.example.eta.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("api/rebalancing")
public class RebalancingController {
    private final PortfolioScheduler portfolioScheduler;
    private final RebalancingService rebalancingService;
    private final PortfolioService portfolioService;

    @PostMapping("/{port_id}/{rn_id}")
    public ResponseEntity<String> applyRebalancing(@PathVariable("port_id") Integer pfId, @PathVariable("rn_id") Integer rnId, @RequestBody RebalancingDto.RebalancingApplyListDto rebalancingApplyListDto) {
        if (rebalancingService.applyRebalancing(pfId, rnId, rebalancingApplyListDto)) {
            return ResponseEntity.ok("Rebalancing applied successfully");
        }
        return ResponseEntity.badRequest().body("Failed to apply rebalancing");
    }

    @GetMapping("/{port_id}/exists")
    public ResponseEntity<RebalancingDto.ExistenceDto> checkRebalancingExists(@PathVariable("port_id") Integer pfId) {
        boolean exists = rebalancingService.existsRebalancingByPortfolioId(pfId);
        RebalancingDto.ExistenceDto responseDto = new RebalancingDto.ExistenceDto(exists);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{port_id}")
    public ResponseEntity<Map<String, Object>> getAllRebalancing(@PathVariable("port_id") Integer pfId) {
        Map<String, Object> response = new HashMap<>();
        response.put("portfolioName", portfolioService.getPortfolioNameById(pfId));
        response.put("rebalancing", rebalancingService.getAllRebalancingsByPortfolioId(pfId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{port_id}/{rn_id}")
    public ResponseEntity<?> deleteRebalancing(@PathVariable("port_id") Integer pfId, @PathVariable("rn_id") Integer rnId) {
        rebalancingService.deleteRebalancing(rnId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{port_id}/execute")
    public ResponseEntity<?> executeRebalancing(@PathVariable("port_id") Integer pfId) {
        int rnId = rebalancingService.executeRebalancingAndGetNotificationId(pfId);
        if (rnId > 0) {
            Portfolio portfolio = portfolioService.findOne(pfId);
            portfolioScheduler.sendRebalancingPushNotification(portfolio.getUser().getToken().getExpoPushToken(), portfolio, rnId);
            Map<String, Integer> response = new HashMap<>();
            response.put("rnId", rnId);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
}
