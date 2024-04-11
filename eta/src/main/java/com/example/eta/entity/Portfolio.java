package com.example.eta.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pfId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(length = 30)
    private String country;

    @Column(nullable = false)
    private Boolean isAuto;

    @Column(nullable = false)
    private Float initAsset;

    @Column(nullable = false)
    private Float currentAsset;

    @Column(nullable = false)
    private Float initCash;

    @Column(nullable = false)
    private Float currentCash;

    @Column(nullable = false)
    private Float rateReturn;

}