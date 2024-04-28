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
}