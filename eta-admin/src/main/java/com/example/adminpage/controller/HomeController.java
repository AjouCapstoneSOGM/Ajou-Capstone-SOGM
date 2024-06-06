package com.example.adminpage.controller;

import com.example.adminpage.repository.PortfolioSectorRepository;
import com.example.adminpage.repository.UserRepository;
import com.example.adminpage.service.PortfolioSectorService;
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
    @RequestMapping("/")
    public String Home(Model model) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Long> countPortfolioBySector = portfolioSectorService.getPortfoliosCountBySector();
        String countPortfolioBySectorJson = objectMapper.writeValueAsString(countPortfolioBySector);

        model.addAttribute("totalUsers", userRepository.count());
        model.addAttribute("countPortfolioBySectorJson", countPortfolioBySectorJson);
        return "home";
    }

}
