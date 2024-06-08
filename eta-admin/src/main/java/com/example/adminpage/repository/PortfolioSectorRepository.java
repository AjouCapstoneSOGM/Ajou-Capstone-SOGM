package com.example.adminpage.repository;


import com.example.adminpage.entity.PortfolioSector;
import com.example.adminpage.entity.compositekey.PortfolioSectorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioSectorRepository extends JpaRepository<PortfolioSector, PortfolioSectorId> {
    @Query("SELECT s.sectorId, COALESCE(COUNT(ps.portfolio), 0) " +
            "FROM Sector s LEFT JOIN s.portfolioSectors ps " +
            "GROUP BY s.sectorId")
    List<Object[]> countPortfoliosBySector();

    @Query("SELECT s.sectorName, AVG((p.currentCash + pt.number * pt.averagePrice) / p.initAsset) * 100 " +
            "FROM PortfolioSector ps " +
            "LEFT JOIN ps.portfolio p " +
            "LEFT JOIN ps.sector s " +
            "LEFT JOIN PortfolioTicker pt ON pt.portfolio = p " +
            "GROUP BY s.sectorName")
    List<Object[]> findSectorReturnRates();

    @Query("SELECT p.riskValue, AVG((p.currentCash + pt.number * pt.averagePrice) / p.initAsset) * 100 " +
            "FROM Portfolio p " +
            "JOIN PortfolioTicker pt ON pt.portfolio = p " +
            "GROUP BY p.riskValue")
    List<Object[]> findRiskReturnRates();
}
