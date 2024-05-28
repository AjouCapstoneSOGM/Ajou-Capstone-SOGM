package com.example.eta.repository;

import com.example.eta.entity.Value;
import com.example.eta.entity.compositekey.ValueId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ValueRepository extends JpaRepository<Value, ValueId> {
    Optional<Value> findFirstByTickerTickerOrderByScoreDateDesc(String ticker);
    @Query("SELECT v FROM Value v WHERE v.ticker.sector.sectorName = :sectorName")
    List<Value> findBySectorName(@Param("sectorName") String sectorName);
}