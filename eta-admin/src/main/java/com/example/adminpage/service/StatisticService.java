package com.example.adminpage.service;

import com.example.adminpage.entity.Statistic;
import com.example.adminpage.repository.StatisticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticService {

    @Autowired
    private StatisticRepository statisticRepository;

    public List<Statistic> getAllStatistics() {
        return statisticRepository.findAllByOrderByDateAsc();
    }
}