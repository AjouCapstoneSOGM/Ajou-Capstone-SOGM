package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor @AllArgsConstructor
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pfId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PortfolioSector> portfolioSectors = new ArrayList<>();

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PortfolioTicker> portfolioTickers = new ArrayList<>();

    @Column
    private String name;

    @Column
    @Setter
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
    @Setter
    private float currentCash;

    @Column
    private int riskValue;
}