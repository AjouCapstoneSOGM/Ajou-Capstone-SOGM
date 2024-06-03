package com.example.adminpage.controller;


import com.example.adminpage.entity.Portfolio;
import com.example.adminpage.repository.PortfolioRepository;
import com.example.adminpage.repository.PortfolioTickerRepository;
import com.example.adminpage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/portfolio-list")
public class PortfolioController {
    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private PortfolioTickerRepository portfolioTickerRepository;

    @GetMapping
    public String getUsers(Model model) {
        model.addAttribute("portfolios", portfolioRepository.findAll());
        return "Portfolio";
    }
    @GetMapping("/search/{searchType}/{query}")
    public String search(@PathVariable("searchType") String searchType, @PathVariable("query") String query, Model model) {
        switch (searchType) {
            case "id":
                portfolioRepository.findById(Integer.valueOf(query)).ifPresent(portfolio -> model.addAttribute("portfolios", List.of(portfolio)));
                break;
            case "userId":
                model.addAttribute("portfolios", portfolioRepository.findAllByUserId(Integer.parseInt(query)));
                break;
            default:
        }
        return "portfolio";
    }
    @DeleteMapping("/{port_id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable("port_id") Integer pfId) {
        portfolioRepository.deleteById(pfId);
        return ResponseEntity.ok().build();
    }
}