package com.example.eta.api;

import com.example.eta.dto.NewsDto;
import com.example.eta.dto.PortfolioDto;
import com.example.eta.dto.TickerDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class ApiClient {

    @Value("${fastApi.url}")
    private String baseUrl;

    public Mono<ResponseEntity<PortfolioDto.CreatedResultFromFastApiDto>> getCreatedPortfolioApi(PortfolioDto.CreateRequestToFastApiDto createRequestToFastApiDto) {
        return WebClient.builder().baseUrl(baseUrl).build()
                .post()
                .uri("/makePortfolio/")
                .body(Mono.just(createRequestToFastApiDto), PortfolioDto.CreateRequestDto.class)
                .retrieve()
                .toEntity(PortfolioDto.CreatedResultFromFastApiDto.class)
                .doOnSuccess((e) -> System.out.println(e.getStatusCode()))
                .doOnError((e) -> System.out.println(e.getMessage()));
    }

    public Mono<ResponseEntity<TickerDto.TickerPriceListDto>> getCurrentTickerPrice(List<String> tickers) {
        return WebClient.builder().baseUrl(baseUrl).build()
                .post()
                .uri("/currentPrice/")
                .body(Mono.just(Collections.singletonMap("tickers", tickers)), Map.class)
                .retrieve()
                .toEntity(TickerDto.TickerPriceListDto.class)
                .doOnSuccess((e) -> System.out.println(e.getStatusCode()))
                .doOnError((e) -> System.out.println(e.getMessage()));
    }

    public Mono<ResponseEntity<NewsDto>> getNewsFromFastApi(String ticker) {
        return WebClient.builder().baseUrl(baseUrl).build()
                .post()
                .uri("/getNews/")
                .body(Mono.just(Collections.singletonMap("ticker", ticker)), Map.class)
                .retrieve()
                .toEntity(NewsDto.class)
                .doOnSuccess(e -> System.out.println(e.getStatusCode()))
                .doOnError(e -> System.out.println(e.getMessage()));
    }
}
