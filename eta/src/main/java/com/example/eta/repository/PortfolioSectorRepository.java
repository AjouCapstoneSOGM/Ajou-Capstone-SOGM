package com.example.eta.repository;

import com.example.eta.entity.PortfolioSector;
import com.example.eta.entity.compositekey.PortfolioSectorId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioSectorRepository extends JpaRepository<PortfolioSector, PortfolioSectorId> {
}
