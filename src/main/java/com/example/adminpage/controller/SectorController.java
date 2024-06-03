package com.example.adminpage.controller;

import com.example.adminpage.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SectorController {
    @Autowired
    private SectorRepository sectorRepository;

    @GetMapping("/sectors")
    public String getUsers(Model model) {
        model.addAttribute("sectors", sectorRepository.findAll());
        return "SectorAndTicker";
    }
}
