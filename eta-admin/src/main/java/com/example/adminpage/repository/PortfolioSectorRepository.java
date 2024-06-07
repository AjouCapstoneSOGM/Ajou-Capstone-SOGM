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
}
