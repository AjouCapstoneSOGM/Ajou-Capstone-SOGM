package com.example.eta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Date;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Data
@ToString(exclude = "user") // User 필드를 toString에서 제외
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pfId;

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