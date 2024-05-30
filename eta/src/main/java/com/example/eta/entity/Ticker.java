package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
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
    private Float marketCap;

    @Column(nullable = false)
    private LocalDateTime updatedDate;

    @Column
    private Integer dividend;

    @Column
    private String equity;

    @Column
    private String dartCode;
}
