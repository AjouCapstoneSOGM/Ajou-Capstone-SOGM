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

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "country", nullable = false, length = 30)
    private String country;

    @Column(name = "is_auto", nullable = false)
    private Boolean isAuto;

    @Column(name = "init_asset", nullable = false)
    private float initAsset;

    @Column(name = "current_asset", nullable = false)
    private float currentAsset;

    @Column(name = "init_cash", nullable = false)
    private float initCash;

    @Column(name = "current_cash", nullable = false)
    private float currentCash;

    @Column(name = "rate_return", nullable = false)
    private float rateReturn;

}