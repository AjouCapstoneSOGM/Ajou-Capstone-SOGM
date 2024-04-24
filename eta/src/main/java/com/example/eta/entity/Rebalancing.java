package com.example.eta.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rebalancing")
public class Rebalancing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rnId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pf_id", nullable = false)
    private Portfolio portfolio;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false)
    private Boolean ignored;
}
