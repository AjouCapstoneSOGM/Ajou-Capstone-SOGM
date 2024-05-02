package com.example.eta.repository;

import com.example.eta.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
    List<Portfolio> findByUserUserId(int userId);
=======
@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
>>>>>>> dev
}
