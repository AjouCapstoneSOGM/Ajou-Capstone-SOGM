package com.example.eta.controller;

import com.example.eta.dto.PortfolioDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/portfolios")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @PostMapping("/{userId}")
    public ResponseEntity<Portfolio> addPortfolio(@PathVariable("userId") int userId, @RequestBody PortfolioDto portfolioDto) {
        Portfolio portfolio = portfolioService.createPortfolio(userId, portfolioDto);
        return new ResponseEntity<>(portfolio, HttpStatus.CREATED);
    }
}
