package com.example.eta.repository;

import com.example.eta.entity.Price;
import com.example.eta.entity.compositekey.PriceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriceRepository extends JpaRepository<Price, PriceId> {

    @Query(value = "SELECT p1.ticker, p1.close, p1.date FROM price p1 " +
            "JOIN (SELECT ticker, MAX(date) AS max_date " +
            "FROM price GROUP BY ticker HAVING ticker = ?1) p2 " +
            "ON p1.ticker = p2.ticker AND p1.date = p2.max_date"
            , nativeQuery = true)
    Optional<Price> findLatestPriceByTicker(String ticker);
}
