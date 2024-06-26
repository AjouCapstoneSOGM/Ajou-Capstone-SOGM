package com.example.adminpage.controller;

import com.example.adminpage.entity.Ticker;
import com.example.adminpage.repository.TickerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

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
            case "name":
                model.addAttribute("tickers", tickerRepository.findAllByNameContaining(query));
                break;
            case "sector":
                model.addAttribute("tickers", tickerRepository.findAllBySectorName(query));
                break;
            default:
        }
        return "Ticker";
    }
    @Transactional
    @DeleteMapping("/{ticker}")
    public ResponseEntity<Void> deleteTicker(@PathVariable("ticker") String ticker) {
        System.out.println("TickerController.deleteTicker:"+ticker);
        tickerRepository.deleteByTicker(ticker);
        return ResponseEntity.ok().build();
    }
}
