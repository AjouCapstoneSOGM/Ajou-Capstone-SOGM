package com.example.eta.service;

import com.example.eta.dto.NewsDto;
import com.example.eta.entity.News;
import com.example.eta.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NewsService {
//    @Autowired
//    private NewsRepository newsRepository;
//
//    public NewsDto getLatestNews(String ticker) {
//        News news = newsRepository.findNewstByTicker(ticker);
//        if ((news == null) || (LocalDateTime.now().toLocalDate() == news.getDate().toLocalDate())
//        {
//            //fastApi에 요청
//            if (fetchedNews != null) {
//                updateNewsDatabase(ticker, fetchedNews);
//                return fetchedNews;
//            }
//        }
//        return new NewsDto(news.getTitle(), news.getContent(), news.getDate());
//    }
//
//    private void updateNewsDatabase(String ticker, NewsDto fetchedNews) {
//        News news = new News();
//        news.setTicker(new Ticker(ticker)); // Assuming Ticker is a mapped entity
//        news.setTitle(fetchedNews.getTitle());
//        news.setContent(fetchedNews.getContent());
//        news.setDate(fetchedNews.getDate());
//        newsRepository.save(news);
//    }
}