package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "ticker")
public class Ticker {

    @Id
    @Column
    private String ticker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String exchange;

    @Column
    private float marketCap;

    @Column(nullable = false)
    private LocalDateTime updatedDate;

    @Column
    private float eps;

    @Column
    private float forwardEps;

    @Column
    private float bps;

    @Column
    private float dps;
}
