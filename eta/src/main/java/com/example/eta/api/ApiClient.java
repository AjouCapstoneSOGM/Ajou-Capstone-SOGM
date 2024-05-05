package com.example.eta.api;

import com.example.eta.dto.PortfolioDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ApiClient {

    @Value("${fastApi.url}")
    private String baseUrl;

    public Mono<ResponseEntity<PortfolioDto.CreatedResultFromFastApiDto>> getCreatedPortfolioApi(PortfolioDto.CreateRequestToFastApiDto createRequestToFastApiDto){
        return WebClient.builder().baseUrl(baseUrl).build()
                .post()
                .uri("/makePortfolio")
                .body(Mono.just(createRequestToFastApiDto), PortfolioDto.CreateRequestDto.class)
                .retrieve()
                .toEntity(PortfolioDto.CreatedResultFromFastApiDto.class)
                .doOnError((e) -> System.out.println(e.getMessage()));
    }
}
