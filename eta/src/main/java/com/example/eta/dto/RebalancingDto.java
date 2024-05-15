package com.example.eta.dto;

import com.example.eta.entity.Ticker;
import lombok.*;

import java.util.List;

public class RebalancingDto {

    @Builder
    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingApplyListDto {
        private List<RebalancingApplyInfo> rnList;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingApplyInfo{
        private String ticker;
        private Boolean isBuy;
        private int quantity;
        private float price;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingInfo{
        private String ticker;
        private String name;
        private int number;
        private Boolean isBuy;
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
