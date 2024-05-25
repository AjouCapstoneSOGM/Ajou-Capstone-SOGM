package com.example.eta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "portfolios") // Portfolio 리스트를 toString에서 제외
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Token token;

    @Builder.Default
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Portfolio> portfolios = new ArrayList<>();

    @Column(nullable = false, length = 100)
    private String email;

    @Column
    private Boolean isVerified;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column
    private LocalDateTime modifiedDate;

    @Column(nullable = false)
    private Boolean enabled;
}

