package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class PortfolioDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequestDto {
        private String country;
        private List<Integer> sector;
        private float asset;
        private int lossLevel;
        private int profitLevel;
    }
}
