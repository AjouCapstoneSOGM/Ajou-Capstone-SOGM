package com.example.eta.auth.filter;

import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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

import static com.example.eta.enums.RoleType.ROLE_USER;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Value("${spring.jwt.header}")
    private String header;

    @Value("${spring.jwt.prefix}")
    private String prefix;

    @Value("${spring.jwt.secret}")
    private String secret;

    private final UserRepository userRepository;

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
        String email = String.valueOf(claims.get("email"));
        var auth = new UsernamePasswordAuthenticationToken(UserPrincipal.create(userRepository.findByEmail(email).get()), null, List.of(new SimpleGrantedAuthority(ROLE_USER.name())));
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }

    // 로그인, 회원가입 API는 JWT 인증 필터 무시
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String requestURI = request.getRequestURI();

        if ((requestURI.startsWith("/api/auth/") || requestURI.startsWith("/docs") || requestURI.startsWith("/api/ticker") || requestURI.endsWith("execute")) && !requestURI.equals("/api/auth/logout")) {
            return true;
        }

        return false;
    }
}
