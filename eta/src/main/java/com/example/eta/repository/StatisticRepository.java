package com.example.eta.repository;

import com.example.eta.entity.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface StatisticRepository extends JpaRepository<Statistic, LocalDate> {
}
