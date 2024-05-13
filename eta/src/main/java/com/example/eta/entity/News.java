package com.example.eta.entity;

import com.example.eta.entity.compositekey.NewsId;
import com.example.eta.entity.compositekey.PriceId;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@IdClass(NewsId.class)
@Table(name = "news")
public class News {

    @Id
    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticker")
    private Ticker ticker;

    @Column(name = "title", nullable = false, length = 256)
    private String title;

    @Column(name = "context", nullable = false, columnDefinition = "TEXT")
    private String context;
}
