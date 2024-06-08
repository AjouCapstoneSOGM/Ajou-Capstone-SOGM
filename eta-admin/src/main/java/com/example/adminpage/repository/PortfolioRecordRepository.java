package com.example.adminpage.repository;


import com.example.adminpage.entity.Portfolio;
import com.example.adminpage.entity.PortfolioRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PortfolioRecordRepository extends JpaRepository<PortfolioRecord, Integer> {

    @Query("SELECT pr FROM PortfolioRecord pr WHERE pr.portfolio.pfId = :pfId")
    List<PortfolioRecord> findAllByPfId(@Param("pfId") int pfId);
}
