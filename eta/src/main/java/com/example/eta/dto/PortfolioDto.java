package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioDto {
    private Boolean isAuto;
    private Float initAsset;
    private Integer riskValue;
}
