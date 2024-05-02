package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class PortfolioDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequestDto {
        private String country;
        private List<String> sector;
        private float asset;
        private int riskValue;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BuyRequestDto {
        private String ticker;
        private boolean isBuy;
        private int quantity;
        private float price;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PerformanceResponseDto {
        private Integer quantity;
        private Float averageCost;
        private String ticker;
        private String companyName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class sellRequestDto {
        private String ticker;
        private boolean sellBuy;
        private int quantity;
        private float price;
    }
}
