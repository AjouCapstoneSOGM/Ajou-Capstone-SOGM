package com.example.eta.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Value("${spring.jwt.header}")
    private String header;

    @Value("${spring.jwt.prefix}")
    private String prefix;

    @Value("${spring.jwt.secret}")
    private String secret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // JWT 토큰 인증, 인증 실패 시 예외 발생
        // TODO: 토큰 관련 예외 정의해서 처리하기
        String jwt = request.getHeader(header).replace(prefix, "");
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        // 인증 성공 시 인증정보 SecurityContext에 저장
        // TODO: email 말고 UserDetails를 저장하도록 구현하기
        String email = String.valueOf(claims.get("email"));
        var auth = new UsernamePasswordAuthenticationToken(email, null, List.of(new SimpleGrantedAuthority("USER")));
//        var auth = new UsernamePasswordAuthenticationToken(
//                new User(String.valueOf(claims.get("email")), "", null),
//                null,
//                List.of(new SimpleGrantedAuthority("USER")));
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }

    // 로그인, 회원가입 API는 JWT 인증 필터 무시
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        List<String> pathsToExclude = List.of("/api/auth/", "/docs");
        return pathsToExclude.stream().anyMatch(path -> request.getRequestURI().startsWith(path));
    }
}
