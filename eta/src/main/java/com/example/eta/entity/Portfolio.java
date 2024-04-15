package com.example.eta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.Date;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Data
@ToString(exclude = "user") // User 필드를 toString에서 제외
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pfId;

    @JsonIgnore
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate = new Date(); // 생성 시점의 날짜 자동 입력

    @Column(length = 30)
    private String country;

    @Column(nullable = false)
    @JsonProperty("isAuto")
    private Boolean isAuto;

    @Column(nullable = false)
    @JsonProperty("initAsset")
    private Float initAsset; // 초기 자산

    @Column(nullable = false)
    private Integer riskValue; // 투자 성향 (리스크 감당 정도)

    @Column(nullable = true, length = 100)
    private String interestArea; // 관심 분야

    @Column(nullable = true)
    private Float currentAsset;

    @Column(nullable = true)
    private Float initCash;

    @Column(nullable = true)
    private Float currentCash;

    @Column(nullable = true)
    private Float rateReturn;
}