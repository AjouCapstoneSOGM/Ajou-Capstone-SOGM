package com.example.eta.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class RebalancingDto {

    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingApplyListDto {
        private List<RebalancingApplyInfoDto> rnList;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingApplyInfoDto {
        private String ticker;
        private Boolean isBuy;
        private int quantity;
        private float price;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingInfoDto {
        private String ticker;
        private String name;
        private int quantity;
        private Boolean isBuy;
        private float price;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RebalancingListDto {
        private int rnId;
        private LocalDateTime createdDate;
        private List<RebalancingInfoDto> rebalancings;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExistenceDto {
        private boolean isExist;
    }
}
