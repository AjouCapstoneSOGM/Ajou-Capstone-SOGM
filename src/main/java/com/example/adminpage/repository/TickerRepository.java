package com.example.adminpage.repository;

import com.example.adminpage.entity.Ticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TickerRepository extends JpaRepository<Ticker, String> {
    Optional<Ticker> findById(String id);

    @Query("SELECT t FROM Ticker t WHERE t.name LIKE %:name%")
    List<Ticker> findAllByNameContaining(@Param("name") String name);

    @Query("SELECT t FROM Ticker t WHERE t.sector.sectorName = :sectorName")
    List<Ticker> findAllBySectorName(@Param("sectorName") String sectorName);

    void deleteByTicker(String ticker);
}
