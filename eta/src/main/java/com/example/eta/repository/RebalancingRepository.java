package com.example.eta.repository;

import com.example.eta.entity.Rebalancing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RebalancingRepository extends JpaRepository<Rebalancing, Integer> {
}
