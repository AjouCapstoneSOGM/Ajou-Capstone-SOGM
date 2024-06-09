package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class RecordDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioRecordGroupedDto {
        private LocalDate date;
        private List<PortfolioRecordDto> records;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioRecordDto {
        private String ticker;
        private int number;
        private float price;
        private boolean isBuy;
    }
}