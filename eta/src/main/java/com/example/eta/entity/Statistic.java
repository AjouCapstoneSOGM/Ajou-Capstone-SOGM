package com.example.eta.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
@Table(name = "statistic")
public class Statistic {

    @Id
    private LocalDate date;

    @Column(nullable = false)
    private int totalUser;

    @Column(nullable = false)
    private int totalPortfolio;

}
