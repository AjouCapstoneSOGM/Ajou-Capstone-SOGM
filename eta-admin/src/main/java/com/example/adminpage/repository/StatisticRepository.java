package com.example.adminpage.repository;

import com.example.adminpage.entity.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatisticRepository extends JpaRepository<Statistic,Long> {
    List<Statistic> findAllByOrderByDateAsc();
}
