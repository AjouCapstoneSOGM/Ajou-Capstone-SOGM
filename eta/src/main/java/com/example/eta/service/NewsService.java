package com.example.eta.service;

import com.example.eta.api.ApiClientFastApi;
import com.example.eta.dto.NewsDto;
import com.example.eta.entity.News;
import com.example.eta.entity.Ticker;
import com.example.eta.repository.NewsRepository;
import com.example.eta.repository.TickerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final TickerRepository tickerRepository;
    private final ApiClientFastApi apiClientFastApi;

    @Transactional
    public NewsDto getNews(String ticker) {
        Optional<News> optionalNews = newsRepository.findFirstByTickerTickerOrderByDateDesc(ticker);

        if (optionalNews.isPresent() && optionalNews.get().getDate().isAfter(LocalDateTime.now().minus(24, ChronoUnit.HOURS))) {
            News news = optionalNews.get();
            return new NewsDto(news.getDate(), news.getSummary());
        } else {
            Mono<ResponseEntity<NewsDto>> responseEntityMono = apiClientFastApi.getNewsFromFastApi(ticker);

            // 비동기 작업을 동기로 처리
            ResponseEntity<NewsDto> responseEntity = responseEntityMono.block();

            if (responseEntity != null && responseEntity.getStatusCode().is2xxSuccessful()) {
                NewsDto newsDto = responseEntity.getBody();

                if (newsDto != null) {
                    // FastAPI 서버에서 받은 뉴스 정보를 DB에 저장

                    Ticker tickerEntity = tickerRepository.findByTicker(ticker);
                    newsRepository.deleteAllByTicker(tickerEntity);

                    News news = new News();
                    news.setDate(LocalDateTime.now());
                    news.setTicker(tickerEntity);
                    news.setSummary(newsDto.getSummary());
                    newsRepository.save(news);

                    return new NewsDto(news.getDate(), news.getSummary());
                }
            }
            return null;
        }
    }
}