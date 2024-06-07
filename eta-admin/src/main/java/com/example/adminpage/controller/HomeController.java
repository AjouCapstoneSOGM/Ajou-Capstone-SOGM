package com.example.adminpage.controller;

import com.example.adminpage.repository.PortfolioSectorRepository;
import com.example.adminpage.repository.UserRepository;
import com.example.adminpage.service.PortfolioSectorService;
import com.example.adminpage.service.PortfolioService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class HomeController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PortfolioSectorService portfolioSectorService;
    @Autowired
    PortfolioService portfolioService;
    @RequestMapping("/")
    public String Home(Model model) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Long> countPortfolioBySector = portfolioSectorService.getPortfoliosCountBySector();
        String countPortfolioBySectorJson = objectMapper.writeValueAsString(countPortfolioBySector);

        Map<Integer, Long> countPortfolioByRiskValue = portfolioService.getPortfoliosCountByRiskValue();
        String countPortfolioByRiskValueJson = objectMapper.writeValueAsString(countPortfolioByRiskValue);

        Map<Integer, Double> returnRates = portfolioService.calculateReturnRates();
        double averageReturnRate = portfolioService.calculateAverageReturnRate();
        String returnRatesJson = objectMapper.writeValueAsString(returnRates);

        // 예금 금리와 비교
        double depositRate = 3.49;
        Map<String, Integer> comparisonResults =
                portfolioService.compareReturnRatesWithDepositRate(depositRate);
        String comparisonResultsJson = objectMapper.writeValueAsString(comparisonResults);


        model.addAttribute("totalUsers", userRepository.count());
        model.addAttribute("countPortfolioBySectorJson", countPortfolioBySectorJson);
        model.addAttribute("countPortfolioByRiskValueJson", countPortfolioByRiskValueJson);
        model.addAttribute("returnRatesJson", returnRatesJson);
        model.addAttribute("averageReturnRate", averageReturnRate);
        model.addAttribute("comparisonResultsJson", comparisonResultsJson);
        System.out.println("HomeController.Home"+comparisonResultsJson);

        return "home";
    }

}
