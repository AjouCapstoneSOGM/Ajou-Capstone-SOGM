package com.example.eta.repository;

import com.example.eta.entity.News;
import com.example.eta.entity.Ticker;
import com.example.eta.entity.compositekey.NewsId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NewsRepository extends JpaRepository<News, NewsId> {
    Optional<News> findFirstByTickerTickerOrderByDateDesc(String ticker);
    void deleteAllByTicker(Ticker ticker);
}
