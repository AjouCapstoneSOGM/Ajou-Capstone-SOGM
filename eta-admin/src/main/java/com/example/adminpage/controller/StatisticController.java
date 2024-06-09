package com.example.adminpage.controller;

import com.example.adminpage.entity.Statistic;
import com.example.adminpage.service.StatisticService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/statistics")
public class StatisticController {
    @Autowired
    StatisticService statisticService;
    ObjectMapper objectMapper;
    public StatisticController(StatisticService statisticService, ObjectMapper objectMapper) {
        this.statisticService = statisticService;
        this.objectMapper = objectMapper;
    }
    @GetMapping("/users")
    public String getUserStatistics(Model model) throws JsonProcessingException {
        List<Statistic> statistics = statisticService.getAllStatistics();
        String statisticsJson = objectMapper.writeValueAsString(statistics);
        model.addAttribute("statisticsJson", statisticsJson);
        return "UserStatistics";
    }

    @GetMapping("/portfolios")
    public String getPortfolioStatistics(Model model) throws JsonProcessingException {
        List<Statistic> statistics = statisticService.getAllStatistics();
        String statisticsJson = objectMapper.writeValueAsString(statistics);
        model.addAttribute("statisticsJson", statisticsJson);
        return "PortfolioStatistics";
    }
}
