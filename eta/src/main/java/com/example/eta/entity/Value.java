package com.example.eta.entity;

import com.example.eta.entity.compositekey.ValueId;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
@IdClass(ValueId.class)
public class Value {
    @Id
    @Column(name = "score_date", nullable = false)
    private LocalDateTime scoreDate;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticker")
    private Ticker ticker;

    @Column(name = "eps")
    private Float eps;

    @Column(name = "bps")
    private Float bps;

    @Column(name = "dps")
    private Float dps;

    @Column(name = "cv_ebitda")
    private Float cvEbitda;

    @Column(name = "pbr")
    private Float pbr;

    @Column(name = "pcr")
    private Float pcr;

    @Column(name = "per")
    private Float per;

    @Column(name = "psr")
    private Float psr;

    @Column(name = "roe")
    private Float roe;

    @Column(name = "roa")
    private Float roa;

    @Column(name = "gpa")
    private Float gpa;

    @Column(name = "op")
    private Float op;

    @Column(name = "cfo")
    private Float cfo;

    @Column(name = "12m_ret")
    private Float m12Ret;

    @Column(name = "k_ratio")
    private Float kRatio;

    @Column(name = "quality")
    private Float quality;

    @Column(name = "value")
    private Float value;

    @Column(name = "momentum")
    private Float momentum;

    @Column(name = "score")
    private Float score;

    @Column(name = "rank")
    private Integer rank;

}
