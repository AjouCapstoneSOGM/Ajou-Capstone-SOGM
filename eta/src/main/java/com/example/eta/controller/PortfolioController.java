package com.example.eta.controller;

import com.example.eta.dto.PortfolioDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/portfolio")
public class PortfolioController {

    @PostMapping("/create/auto")
    public ResponseEntity<Object> createAutoPortfolio(@RequestBody PortfolioDto.CreateRequestDto createRequestDto,
                                                      @AuthenticationPrincipal String email) {
        // 사용자 정보 가져오기

        // FastAPI 서버에 요청

        // 생성된 포트폴리오 DB에 저장

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
