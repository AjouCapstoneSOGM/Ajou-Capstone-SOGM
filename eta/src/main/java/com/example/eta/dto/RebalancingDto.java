package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class RebalancingDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingInfo{
        private String ticker;
        private String name;
        private int number;
        private boolean isBuy;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingListDto {
        int rnId;
        private List<RebalancingInfo> rebalancings;
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExistenceDto {
        private boolean isExist;
    }
}
