package com.example.eta.entity;

import com.example.eta.entity.compositekey.RebalancingTickerId;
import jakarta.persistence.*;
import lombok.Getter;

import java.io.Serializable;

@Entity
@IdClass(RebalancingTickerId.class)
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
}