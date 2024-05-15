package com.example.eta.repository;

import com.example.eta.entity.PortfolioRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRecordRepository extends JpaRepository<PortfolioRecord, Integer> {
}
