package com.example.eta.service;

import com.example.eta.api.ApiClient;
import com.example.eta.dto.NewsDto;
import com.example.eta.entity.News;
import com.example.eta.entity.Ticker;
import com.example.eta.repository.NewsRepository;
import com.example.eta.repository.TickerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private TickerRepository tickerRepository;
    @Autowired
    private ApiClient apiClient;

    public NewsDto getNews(String ticker) {
        Optional<News> optionalNews = newsRepository.findFirstByTickerTickerOrderByDateDesc(ticker);

        if (optionalNews.isPresent() && optionalNews.get().getDate().isAfter(LocalDateTime.now().minus(24, ChronoUnit.HOURS))) {
            News news = optionalNews.get();
            return new NewsDto(news.getSummary(), news.getDate());
        } else {
            Mono<ResponseEntity<NewsDto>> responseEntityMono = apiClient.getNewsFromFastApi(ticker);

            // 비동기 작업을 동기로 처리
            ResponseEntity<NewsDto> responseEntity = responseEntityMono.block();

            if (responseEntity != null && responseEntity.getStatusCode().is2xxSuccessful()) {
                NewsDto newsDto = responseEntity.getBody();

                if (newsDto != null) {
                    // FastAPI 서버에서 받은 뉴스 정보를 DB에 저장
                    Ticker tickerEntity = tickerRepository.findByTicker(ticker);
                    News news = new News();
                    news.setDate(newsDto.getDate());
                    news.setTicker(tickerEntity);
                    news.setSummary(newsDto.getSummary());
                    newsRepository.save(news);

                    return newsDto;
                }
            }
            return null;
        }
    }
}