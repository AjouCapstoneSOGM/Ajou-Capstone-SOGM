package com.example.eta.repository;

import com.example.eta.entity.Ticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TickerRepository extends JpaRepository<Ticker, String> {

    // TODO: exchange를 국가별로 관리하게 될 경우, 그에 맞춰서 SQL문 수정 (현재는 country값과 무관하게 KOSPI, KOSDAQ만 조회)

    @Query(value = "SELECT ticker.ticker, ticker.name, ticker.exchange, ticker.market_cap, ticker.updated_date, ticker.dividend, ticker.equity, ticker.dart_code, ticker.sector_id " +
            "FROM ticker INNER JOIN value on ticker.ticker = value.ticker " +
            "WHERE sector_id = ?1 AND (exchange = 'KOSPI' OR exchange = 'KOSDAQ') " +
            "ORDER BY value.ranking ASC " +
            "LIMIT ?2"
            , nativeQuery = true)
    List<Ticker> findTopTickersBySector(String sectorId, int num, String country);

    @Query(value = "SELECT ticker.ticker, ticker.name, ticker.exchange, ticker.market_cap, ticker.updated_date, ticker.dividend, ticker.equity, ticker.dart_code, ticker.sector_id " +
            "FROM ticker " +
            "WHERE ticker.equity = '안전자산' " +
            "ORDER BY ticker.market_cap DESC "
            , nativeQuery = true)
    List<Ticker> findSafeAssetTickers(String country);

    @Query(value = "SELECT ticker.ticker, ticker.name, ticker.exchange, ticker.market_cap, ticker.updated_date, ticker.dividend, ticker.equity, ticker.dart_code, ticker.sector_id " +
            "FROM ticker INNER JOIN ticker_search on ticker.ticker = ticker_search.ticker " +
            "WHERE ticker_search.decomposed_name LIKE CONCAT('%', ?1, '%') OR ticker_search.ticker LIKE CONCAT('%', ?1, '%') " +
            "ORDER BY ticker.market_cap DESC " +
            "LIMIT ?2"
            , nativeQuery = true)
    List<Ticker> findTickersByDecomposedText(String decomposedText, int num);

    Ticker findByTicker(String ticker);
}
