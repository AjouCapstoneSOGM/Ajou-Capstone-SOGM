package com.example.eta.entity;

import com.example.eta.entity.compositekey.NewsId;
import com.example.eta.entity.compositekey.PriceId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
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
    @Column(name = "summary", nullable = false, columnDefinition = "TEXT")
    private String summary;
}
