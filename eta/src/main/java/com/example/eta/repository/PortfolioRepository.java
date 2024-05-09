package com.example.eta.repository;

import com.example.eta.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
    List<Portfolio> findAllByIsAutoIsTrue();
}
