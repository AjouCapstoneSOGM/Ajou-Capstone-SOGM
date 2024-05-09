package com.example.eta.entity;

import com.example.eta.entity.compositekey.PriceId;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
@IdClass(PriceId.class)
@Table(name = "financial_statement")
public class FinancialStatement {
    @Id
    @Column(nullable = false)
    private LocalDateTime date;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticker")
    private Ticker ticker;

    @Column
    private String account;

    @Column
    private Float value;

    @Column
    private String period;
}
