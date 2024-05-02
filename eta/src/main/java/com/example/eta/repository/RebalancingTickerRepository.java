package com.example.eta.repository;

import com.example.eta.entity.RebalancingTicker;
import com.example.eta.entity.compositekey.RebalancingTickerId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RebalancingTickerRepository extends JpaRepository<RebalancingTicker, RebalancingTickerId> {
}
