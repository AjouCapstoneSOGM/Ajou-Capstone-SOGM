package com.example.adminpage.repository;

import com.example.adminpage.entity.Portfolio;
import com.example.adminpage.entity.PortfolioTicker;
import com.example.adminpage.entity.Ticker;
import com.example.adminpage.entity.compositekey.PortfolioTickerId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioTickerRepository extends JpaRepository<PortfolioTicker, PortfolioTickerId> {

    List<PortfolioTicker> findAllByPortfolio(Portfolio portfolio);

    Optional<PortfolioTicker> findByPortfolioAndTicker(Portfolio portfolio, Ticker ticker);
}
