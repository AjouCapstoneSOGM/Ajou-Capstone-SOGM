package com.example.eta.repository;

import com.example.eta.entity.Portfolio;
import com.example.eta.entity.Rebalancing;
import com.example.eta.entity.RebalancingTicker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RebalancingRepository extends JpaRepository<Rebalancing, Integer> {
    List<Rebalancing> findAllByPortfolio(Portfolio portfolio);
    boolean existsByPortfolioPfId(Integer pfId);
    List<Rebalancing> findByPortfolioPfId(Integer pfId);
}
