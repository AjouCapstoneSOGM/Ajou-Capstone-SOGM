package com.example.eta.controller;

import com.example.eta.dto.UserDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.Password;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${spring.jwt.header}")
    private String header;

    @Value("${spring.jwt.prefix}")
    private String prefix;

    @Value("${spring.jwt.secret}")
    private String secret;

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> authorize(@RequestBody UserDto.Login loginDto) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());

        // 인증
        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // JWT 토큰 발급
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        String jwt = Jwts.builder()
                .setClaims(Map.of("email", loginDto.getEmail()))
                .signWith(key)
                .compact();

        // 응답
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(header, prefix + jwt);
        HashMap<String, Object> response = new HashMap<>(){{
            put("token", jwt);
        }};

        return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);
    }
}
