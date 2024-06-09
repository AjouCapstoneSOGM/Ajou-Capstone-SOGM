package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "portfolio_record")
public class PortfolioRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rec_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "pf_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne
    @JoinColumn(name = "ticker", nullable = false)
    private Ticker ticker;

    @Column(nullable = false)
    private LocalDateTime recordDate;

    @Column(nullable = false)
    private int number;

    @Column(nullable = false)
    private float price;

    @Column(nullable = false)
    private boolean isBuy;
}
