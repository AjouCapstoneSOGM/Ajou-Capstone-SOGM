package com.example.eta.controller;

import com.example.eta.dto.UserDto;
import com.example.eta.entity.User;
import com.example.eta.exception.EmailAlreadyExistsException;
import com.example.eta.service.TokenService;
import com.example.eta.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${spring.jwt.header}")
    private String header;

    @Value("${spring.jwt.prefix}")
    private String prefix;

    @Value("${spring.jwt.secret}")
    private String secret;

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<Object> authorize(@RequestBody UserDto.LoginDto loginDto) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());

        // 인증
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // JWT 토큰 발급
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        String jwt = Jwts.builder()
                .setClaims(Map.of("email", loginDto.getEmail()))
                .signWith(key)
                .compact();

        // expo 토큰 저장
        tokenService.saveToken(userService.findByEmail(loginDto.getEmail()), loginDto.getExpoPushToken());

        // 응답
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(header, prefix + jwt);
        HashMap<String, Object> response = new HashMap<>(){{
            put("token", jwt);
            put("user_id", userService.findByEmail(loginDto.getEmail()).getUserId());
        }};

        return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@RequestBody @Valid UserDto.InfoDto InfoDto) throws RuntimeException{
        if(userService.isExistEmail(InfoDto.getEmail())) throw new EmailAlreadyExistsException();

        User user = new User();
        user.setName(InfoDto.getName());
        user.setPassword(passwordEncoder.encode(InfoDto.getPassword()));
        user.setEmail(InfoDto.getEmail());
        user.setIsVerified(false);
        user.setRole("USER");
        user.setCreatedDate(LocalDateTime.now());
        user.setEnabled(true);

        HashMap<String, Object> response = new HashMap<>(){{
            put("user_id", userService.join(user));
        }};
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}