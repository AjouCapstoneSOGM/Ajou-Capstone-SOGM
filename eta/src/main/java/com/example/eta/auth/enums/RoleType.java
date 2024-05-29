package com.example.eta.auth.enums;

import lombok.Getter;

@Getter
public enum RoleType {
    ROLE_USER("일반 사용자");

    private String description;

    RoleType(String description) {
        this.description = description;
    }
}
