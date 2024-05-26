package com.example.eta.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ApiClientSocial {

    @Value("${social.kakao.url}")
    private String kakaoUrl;

    public Mono<ResponseEntity<Map>> getKakaoUserDetails(String accessToken) {
        // Map<String, List> requestBody = new HashMap<>();
        // requestBody.put("property_keys", List.of("kakao_account.email", "kakao_account.name"));

        return WebClient.builder().baseUrl(kakaoUrl).build()
                .post()
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                // .body(Mono.just(requestBody), Map.class)
                .retrieve()
                .toEntity(Map.class)
                .doOnSuccess(e -> System.out.println(e.getStatusCode()))
                .doOnError(e -> System.out.println(e.getMessage()));
    }
}
