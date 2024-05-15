package com.example.eta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@Builder
@NoArgsConstructor @AllArgsConstructor
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pfId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PortfolioSector> portfolioSectors = new ArrayList<>();

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
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
    @Setter
    private float initCash;

    @Column(nullable = false)
    @Setter
    private float currentCash;

    @Column
    private int riskValue;

    public void updateCurrentCash(float currentCash){
        this.currentCash = currentCash;
    }
}