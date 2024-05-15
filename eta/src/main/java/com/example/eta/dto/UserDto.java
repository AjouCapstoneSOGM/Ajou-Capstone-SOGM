package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UserDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InfoDto {
        private String name;
        private String email;
        private String password;

    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginDto {
        private String email;
        private String password;
        private String fcmToken;
    }
}
