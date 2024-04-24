package com.example.eta.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pfId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false, length = 30)
    private String country;

    @Column(nullable = false)
    private Boolean isAuto;

    @Column(nullable = false)
    private float initAsset;

    @Column(nullable = false)
    private float initCash;

    @Column(nullable = false)
    private float currentCash;

    @Column
    private Boolean riskValue;
}