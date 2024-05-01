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
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class CreateRequestToFastApiDto {
        private List<String> tickers;
        private float safe_asset_ratio;
        private int initial_cash;
    }

    @Data
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class CreatedResultFromFastApiDto {
        private List<Integer> init_asset_num;
        private int cash_hold;
        private List<Float> total_radio_final;
        private float final_returns;
        private float final_vol;
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
}
