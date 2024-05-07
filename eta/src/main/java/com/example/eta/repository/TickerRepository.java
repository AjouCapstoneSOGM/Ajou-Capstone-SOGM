package com.example.eta.repository;

import com.example.eta.entity.Ticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TickerRepository extends JpaRepository<Ticker, String> {

    @Query(value = "SELECT ticker.ticker, ticker.name, ticker.exchange, ticker.market_cap, ticker.updated_date, ticker.dividend, ticker.equity, ticker.sector_id " +
            "FROM ticker INNER JOIN value on ticker.ticker = value.ticker " +
            "WHERE sector_id = ?1 AND (exchange = 'KOSPI' OR exchange = 'KOSDAQ') " +
            "ORDER BY value.rank ASC " +
            "LIMIT ?2"
            , nativeQuery = true)
    List<Ticker> findTopTickerBySector(String sectorId, int num, String country);
}
