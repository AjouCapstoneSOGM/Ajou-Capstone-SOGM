package com.example.eta.entity;

import com.example.eta.entity.compositekey.RebalancingTickerId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(RebalancingTickerId.class)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rebalancing_ticker")
public class RebalancingTicker {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rn_id")
    private Rebalancing rebalancing;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticker")
    private Ticker ticker;

    @Column(nullable = false)
    private Boolean isBuy;

    @Column(nullable = false)
    private int number;
}