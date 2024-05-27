package com.example.eta.entity;

import com.example.eta.entity.compositekey.ValueId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@IdClass(ValueId.class)
@Table(name = "value")
public class Value {

    @Id
    @Column(name = "score_date", nullable = false)
    private LocalDateTime scoreDate;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticker", nullable = false)
    private Ticker ticker;

    @Column(name = "sector_name", nullable = false, length = 40)
    private String sectorName;

    @Column(name = "roe", nullable = true)
    private Float roe;

    @Column(name = "roa", nullable = true)
    private Float roa;

    @Column(name = "gpa", nullable = true)
    private Float gpa;

    @Column(name = "gm", nullable = true)
    private Float gm;

    @Column(name = "op", nullable = true)
    private Float op;

    @Column(name = "cfroa", nullable = true)
    private Float cfroa;

    @Column(name = "ev_ebitda", nullable = true)
    private Float evEbitda;

    @Column(name = "ev_sales", nullable = true)
    private Float evSales;

    @Column(name = "per", nullable = true)
    private Float per;

    @Column(name = "pbr", nullable = true)
    private Float pbr;

    @Column(name = "pcr", nullable = true)
    private Float pcr;

    @Column(name = "psr", nullable = true)
    private Float psr;

    @Column(name = "dps", nullable = true)
    private Float dps;

    @Column(name = "12m_ret", nullable = true)
    private Float twelveMonthRet;

    @Column(name = "k_ratio", nullable = true)
    private Float kRatio;

    @Column(name = "quality", nullable = true)
    private Float quality;

    @Column(name = "value", nullable = true)
    private Float value;

    @Column(name = "momentum", nullable = true)
    private Float momentum;

    @Column(name = "score", nullable = true)
    private Float score;

    @Column(name = "ranking", nullable = true)
    private Integer ranking;
}