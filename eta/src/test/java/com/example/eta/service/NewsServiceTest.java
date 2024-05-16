package com.example.eta.service;

import com.example.eta.api.ApiClient;
import com.example.eta.dto.NewsDto;
import com.example.eta.entity.News;
import com.example.eta.entity.Ticker;
import com.example.eta.repository.NewsRepository;
import com.example.eta.repository.TickerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NewsServiceTest {
    @Mock
    private NewsRepository newsRepository;

    @Mock
    private TickerRepository tickerRepository;

    @Mock
    private ApiClient apiClient;

    @InjectMocks
    private NewsService newsService;

    private Ticker ticker;
    private News news;
    private NewsDto newsDto;

    @BeforeEach
    public void setUp() {
        ticker = new Ticker();
        ticker.setTicker("034730");

        news = new News();
        news.setTicker(ticker);
        news.setDate(LocalDateTime.now().minusHours(12));
        news.setSummary("news content");

        newsDto = new NewsDto();
        newsDto.setSummary("New news content from FastAPI");
        newsDto.setDate(LocalDateTime.now());
    }

    //DB에 뉴스가 있는 경우
    @Test
    public void testGetNews_WhenNewsIsRecent() {
        // Given
        when(newsRepository.findFirstByTickerTickerOrderByDateDesc(anyString()))
                .thenReturn(Optional.of(news));

        // When
        NewsDto result = newsService.getNews(ticker.getTicker());

        // Then
        assertThat(result.getSummary()).isEqualTo(news.getSummary());
        assertThat(result.getDate()).isEqualTo(news.getDate());
    }

    //DB에 뉴스가 없는 경우
    @Test
    public void testGetNews_WhenNewsIsOldOrNotPresent() {
        // Given
        when(newsRepository.findFirstByTickerTickerOrderByDateDesc(anyString()))
                .thenReturn(Optional.empty());

        when(apiClient.getNewsFromFastApi(anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok(newsDto)));

        // When
        NewsDto result = newsService.getNews(ticker.getTicker());

        // Then
        assertThat(result.getSummary()).isEqualTo(newsDto.getSummary());
        assertThat(result.getDate()).isEqualTo(newsDto.getDate());
    }

    //뉴스최신화가 25시간 전 인 경우
    @Test
    public void testGetNews_WhenNewsIs25HoursOld() {
        // Given
        news.setDate(LocalDateTime.now().minusHours(25)); // 25시간 전 뉴스
        when(newsRepository.findFirstByTickerTickerOrderByDateDesc(anyString()))
                .thenReturn(Optional.of(news));

        // When
        when(apiClient.getNewsFromFastApi(anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok(newsDto)));

        when(tickerRepository.findByTicker(anyString())).thenReturn((ticker));

        NewsDto result = newsService.getNews(ticker.getTicker());

        // Then
        assertThat(result.getSummary()).isEqualTo(newsDto.getSummary());
        assertThat(result.getDate()).isEqualTo(newsDto.getDate());

        // 추가 검증: DB의 저장된 뉴스 정보와 FastAPI에서 가져온 뉴스 정보 비교
        assertThat(result.getDate()).isAfter(news.getDate());
    }
}