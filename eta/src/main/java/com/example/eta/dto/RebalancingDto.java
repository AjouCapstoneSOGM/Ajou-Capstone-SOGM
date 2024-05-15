package com.example.eta.dto;

import com.example.eta.entity.Ticker;
import lombok.*;

import java.util.List;

public class RebalancingDto {

    @Getter
    @Setter
    private List<RebalancingDetail> rnList;
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
    public static class RebalancingDetail {
        private String ticker;
        private boolean isBuy;
        private int quantity;
        private float price;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExistenceDto {
        private boolean isExist;
    }
}
