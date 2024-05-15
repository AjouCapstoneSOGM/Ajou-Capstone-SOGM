package com.example.eta.controller;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.service.RebalancingService;
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
    private final RebalancingService rebalancingService;


    @PostMapping("/{port_id}/{rn_id}")
    public ResponseEntity<String> applyRebalancing(@PathVariable Integer port_id, @PathVariable Integer rn_id, @RequestBody RebalancingDto rebalancingDto) {
        if (rebalancingService.applyRebalancing(port_id, rn_id, rebalancingDto)) {
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
    public ResponseEntity<Map<String, List<RebalancingDto.RebalancingListDto>>> getAllRebalancing(@PathVariable("port_id") Integer pfId) {
        Map<String, List<RebalancingDto.RebalancingListDto>> response = new HashMap<>();
        response.put("rebalancing", rebalancingService.getAllRebalancingsByPortfolioId(pfId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{port_id}/{rn_id}")
    public ResponseEntity<?> deleteRebalancing(@PathVariable("port_id") Integer pfId, @PathVariable("rn_id") Integer rnId) {
        try {
            rebalancingService.deleteRebalancing(rnId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting rebalancing notification: " + e.getMessage());
        }
    }

    @PutMapping("/{port_id}/execute")
    public ResponseEntity<?> executeRebalancing(@PathVariable("port_id") Integer pfId) {
        int rnId = rebalancingService.executeRebalancingAndGetNotificationId(pfId);
        if (rnId > 0) {
            Map<String, Integer> response = new HashMap<>();
            response.put("rnId", rnId);
            return ResponseEntity.ok(response);
        }
        else {
            return ResponseEntity.noContent().build();
        }
    }
}
