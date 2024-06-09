package com.example.eta.controller;

import com.example.eta.dto.RecordDto;
import com.example.eta.service.PortfolioRecordService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/portfolioRecord")
public class PortfolioRecordController {

    private final PortfolioRecordService portfolioRecordService;

    @GetMapping("/{port_id}")
    public ResponseEntity<List<RecordDto.PortfolioRecordGroupedDto>> getGroupedPortfolioRecords(@PathVariable("port_id") Integer pfId) {
        List<RecordDto.PortfolioRecordGroupedDto> groupedRecords = portfolioRecordService.getGroupedPortfolioRecords(pfId);
        return ResponseEntity.ok(groupedRecords);
    }
}