package com.example.eta.auth.enums;

import lombok.Getter;

@Getter
public enum SocialType {
    KAKAO("카카오");

    private String socialServiceName;

    SocialType(String socialServiceName) {
        this.socialServiceName = socialServiceName;
    }
}
