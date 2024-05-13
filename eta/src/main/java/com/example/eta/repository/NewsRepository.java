package com.example.eta.repository;

import com.example.eta.entity.News;

public interface NewsRepository {
    News findNewstByTicker(String ticker);
}
