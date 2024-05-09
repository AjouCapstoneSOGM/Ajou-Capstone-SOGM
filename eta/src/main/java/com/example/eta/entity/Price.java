package com.example.eta.entity;

import com.example.eta.entity.compositekey.PriceId;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@IdClass(PriceId.class)
@Getter
@Table(name = "price")
public class Price {
    @Id
    private LocalDateTime date;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticker")
    private Ticker ticker;

    @Column
    private Double close;
}
