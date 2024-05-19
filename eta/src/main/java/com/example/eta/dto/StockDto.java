package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class StockDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockInfo {
        private String ticker;
        private String name;
        private String exchange;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockInfoListDto {
        private List<StockInfo> searchedList;
    }
}
