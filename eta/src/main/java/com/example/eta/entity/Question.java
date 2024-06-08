package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor @AllArgsConstructor
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    @Setter
    String title;

    @Column(nullable = false)
    @Setter
    String content;

    @Column(nullable = false)
    LocalDateTime createdDate;

    @Column
    String answer;

    @Column
    LocalDateTime answeredDate;
}
