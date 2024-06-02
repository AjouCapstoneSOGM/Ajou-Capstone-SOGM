package com.example.adminpage.controller;

import com.example.adminpage.entity.Ticker;
import com.example.adminpage.repository.TickerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("ticker")
public class TickerController {
    @Autowired
    private TickerRepository tickerRepository;

    @GetMapping
    public String getUsers() {
//        model.addAttribute("tickers", tickerRepository.findAll());
        return "Ticker";
    }

    @GetMapping("/search/{searchType}/{query}")
    public String search(@PathVariable("searchType") String searchType, @PathVariable("query") String query, Model model) {
        switch (searchType) {
            case "id":
                tickerRepository.findById(query).ifPresent(ticker -> model.addAttribute("tickers", ticker));
                break;
//            case "name":
//                model.addAttribute("tickers", tickerRepository.findByNameContaining(query));
//                break;
//            case "sectorId":
//                model.addAttribute("tickers", tickerRepository.findBySectorId(Integer.parseInt(query)));
//                break;
            default:
                model.addAttribute("tickers", tickerRepository.findAll());
        }
        return "Ticker";
    }
}
