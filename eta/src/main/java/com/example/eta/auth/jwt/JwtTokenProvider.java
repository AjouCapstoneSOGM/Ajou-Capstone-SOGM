package com.example.eta.auth.jwt;

import com.example.eta.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${spring.jwt.secret}")
    private String secret;

    public String generateJwtToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        String jwt = Jwts.builder()
                .setClaims(Map.of("email", user.getEmail()))
                .signWith(key)
                .compact();
        return jwt;
    }
}
