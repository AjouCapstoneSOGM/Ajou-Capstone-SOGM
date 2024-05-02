package com.example.eta.entity;

import com.example.eta.entity.compositekey.PortfolioTickerId;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@IdClass(PortfolioTickerId.class)
@Data
@Table(name = "portfolio_ticker")
public class PortfolioTicker {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pf_id")
    private Portfolio portfolio;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticker")
    private Ticker ticker;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "average_price", nullable = false)
    private Float averagePrice;

    @Column(name = "init_proportion", nullable = false)
    private Float initProportion;

    @Column(name = "current_proportion", nullable = false)
    private Float currentProportion;
}

