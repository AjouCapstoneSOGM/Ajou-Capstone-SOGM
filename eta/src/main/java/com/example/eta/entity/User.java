package com.example.eta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@ToString(exclude = "portfolios") // Portfolio 리스트를 toString에서 제외
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @JsonIgnore
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

