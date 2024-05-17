package com.example.eta.controller;

import com.example.eta.dto.NewsDto;
import com.example.eta.service.NewsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/stocks")
public class StocksController {

    private final NewsService newsService;

    @GetMapping("/{ticker}/news")
    public ResponseEntity<NewsDto> getNews(@PathVariable String ticker) {
        NewsDto newsDto = newsService.getNews(ticker);
        if (newsDto != null) {
            return ResponseEntity.ok(newsDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
