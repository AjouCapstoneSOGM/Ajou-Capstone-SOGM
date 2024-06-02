package com.example.adminpage.repository;

import com.example.adminpage.entity.Ticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TickerRepository extends JpaRepository<Ticker, String> {
    Optional<Ticker> findById(String id);
}
