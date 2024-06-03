package com.example.adminpage.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "signup_info")
public class SignupInfo {

    @Id
    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(nullable = false)
    private LocalDateTime codeExpires;

    @Column(nullable = false)
    private Boolean isVerified;

    @Column(length = 20)
    private String signupToken;

}
