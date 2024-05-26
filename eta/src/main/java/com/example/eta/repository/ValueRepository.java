package com.example.eta.repository;

import com.example.eta.entity.Value;
import com.example.eta.entity.compositekey.ValueId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ValueRepository extends JpaRepository<Value, ValueId> {
    Optional<Value> findFirstByTickerTickerOrderByScoreDateDesc(String ticker);
}