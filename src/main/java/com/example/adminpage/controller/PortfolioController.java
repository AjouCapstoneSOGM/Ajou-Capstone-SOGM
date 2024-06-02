package com.example.adminpage.controller;


import com.example.adminpage.repository.PortfolioRepository;
import com.example.adminpage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PortfolioController {
    @Autowired
    private PortfolioRepository portfolioRepository;

    @GetMapping("/portfolio-list")
    public String getUsers(Model model) {
        model.addAttribute("portfolios", portfolioRepository.findAll());
        return "Portfolio";
    }
}