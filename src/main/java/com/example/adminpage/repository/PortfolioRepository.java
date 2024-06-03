package com.example.adminpage.repository;

import com.example.adminpage.entity.Portfolio;
import com.example.adminpage.entity.Ticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
    @Query("SELECT p FROM Portfolio p WHERE p.user.userId = :userId")
    List<Portfolio> findAllByUserId(@Param("userId") int userId);


}
