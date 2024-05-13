package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class RebalancingDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InfoDto{
        private String ticker;
        private String name;
        private int number;
        private boolean isBuy;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExistenceDto {
        private boolean isExist;
    }
}
