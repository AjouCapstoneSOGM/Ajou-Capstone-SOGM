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
@RequestMapping("/stocks")
public class NewsController {
//    private final NewsService newsService;
//
//    @Autowired
//    public NewsController(NewsService newsService) {
//        this.newsService = newsService;
//    }
//
//    @GetMapping("/{ticker}/news")
//    public ResponseEntity<NewsDto> getNews(@PathVariable{"ticker"} String ticker) {
//        NewsDto news = newsService.getLatestNews(ticker);
//        if (news != null) {
//            return ResponseEntity.ok(news);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
}
