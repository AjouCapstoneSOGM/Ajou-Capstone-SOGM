package com.example.eta.entity.compositekey;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PortfolioTickerId implements Serializable {
    private int portfolio;
    private String ticker;
}
