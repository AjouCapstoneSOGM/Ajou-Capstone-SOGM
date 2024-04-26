package com.example.eta.entity;

import com.example.eta.entity.compositekey.RebalancingTickerId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@IdClass(RebalancingTickerId.class)
@Getter
@Builder
@NoArgsConstructor @AllArgsConstructor
@Table(name = "rebalancing_ticker")
public class RebalancingTicker {

    @Id
    @ManyToOne
    @JoinColumn(name = "rn_id")
    private Portfolio portfolio;

    @Id
    @ManyToOne
    @JoinColumn(name = "ticker")
    private Ticker ticker;

    @Column(nullable = false)
    private Boolean isBuy;

    @Column(nullable = false)
    private int number;
}