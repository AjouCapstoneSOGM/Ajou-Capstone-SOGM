package com.example.eta.repository;

import com.example.eta.entity.PortfolioRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioRecordRepository extends JpaRepository<PortfolioRecord, Integer> {
    List<PortfolioRecord> findAllByPortfolioPfId(Integer pfId);
}
