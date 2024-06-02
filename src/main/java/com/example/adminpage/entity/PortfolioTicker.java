package com.example.adminpage.entity;

import com.example.adminpage.entity.compositekey.PortfolioTickerId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@IdClass(PortfolioTickerId.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    public void updateNumber(Integer number) {
        this.number = number;
    }
}

