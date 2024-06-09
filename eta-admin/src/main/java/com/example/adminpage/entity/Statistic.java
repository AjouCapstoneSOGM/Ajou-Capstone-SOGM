package com.example.adminpage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "statistic")
public class Statistic {

    @Id
    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "total_user", nullable = false)
    private int userNum;

    @Column(name = "total_portfolio", nullable = false)
    private int portfolioNum;
}
