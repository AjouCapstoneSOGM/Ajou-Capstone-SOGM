package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class TickerDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TickerInfo {
        private String ticker;
        private String name;
        private String exchange;
    }
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TickerDetailDto{
        private String name;
        private String ticker;
        private Float roe;
        private Float roa;
        private Float per;
        private Float pbr;
        private Float twelveMonthRet;
        private int roeRank;
        private int roaRank;
        private int perRank;
        private int pbrRank;
        private int twelveMonthRetRank;
        private int total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TickerInfoListDto {
        private List<TickerInfo> searchedList;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TickerPrice {
        private String ticker;
        private float current_price;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TickerPriceListDto {
        private List<TickerPrice> prices;
    }

}
