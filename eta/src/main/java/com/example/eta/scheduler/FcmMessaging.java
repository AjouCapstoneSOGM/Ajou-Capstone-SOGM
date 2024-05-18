package com.example.eta.scheduler;


import com.example.eta.dto.FcmMessageDto;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FcmMessaging {

    public void triggerFcmMessage(String fcmToken, String title, String body) throws IOException {
        FcmMessageDto fcmMessageDto = FcmMessageDto.builder()
                .validateOnly(false)
                .message(FcmMessageDto.Message.builder()
                        .notification(FcmMessageDto.Notification.builder()
                                .title(title)
                                .body(body)
                                .build())
                        .token(fcmToken)
                        .build())
                .build();

        ResponseEntity<FcmMessageDto.Message> responseEntity = WebClient.builder().baseUrl("https://fcm.googleapis.com/v1/projects/eta-firebase-91f48/messages:send").build()
                .post()
                .body(Mono.just(fcmMessageDto), FcmMessageDto.class)
                .header("Authorization", "Bearer " + getAccessToken())
                .header("Content-Type", "application/json")
                .retrieve()
                .toEntity(FcmMessageDto.Message.class).block();

        // TODO: 로깅
        System.out.println(responseEntity.getStatusCode());
    }


    public String getAccessToken() throws IOException {
        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new ClassPathResource("firebase-private-key.json").getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        credentials.refreshIfExpired();
        return credentials.refreshAccessToken().getTokenValue();
    }
}
