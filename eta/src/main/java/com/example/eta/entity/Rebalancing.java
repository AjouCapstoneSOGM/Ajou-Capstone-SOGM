package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor @AllArgsConstructor
@Table(name = "rebalancing")
public class Rebalancing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rnId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pf_id", nullable = false)
    private Portfolio portfolio;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @OneToMany(mappedBy = "rebalancing", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RebalancingTicker> rebalancingTickers = new ArrayList<>();
}
