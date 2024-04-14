package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @OneToMany(mappedBy = "user")
    private List<Portfolio> portfolios = new ArrayList<>();

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "password")
    private String password;

    @Column(name = "name", nullable = false, length = 30)
    private String name;

    @Column(name = "role", nullable = false)
    private int role;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "modified_date")
    private LocalDateTime modifiedDate;

    @Column(name = "is_suspended", nullable = false)
    private Boolean isSuspended;

}

