package com.example.eta.repository;

import com.example.eta.entity.Portfolio;
import com.example.eta.entity.PortfolioTicker;
import com.example.eta.entity.Ticker;
import com.example.eta.entity.compositekey.PortfolioTickerId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PortfolioTickerRepository extends JpaRepository<PortfolioTicker, PortfolioTickerId> {
    Optional<PortfolioTicker> findByPortfolioAndTicker(Portfolio portfolio, Ticker ticker);
}
