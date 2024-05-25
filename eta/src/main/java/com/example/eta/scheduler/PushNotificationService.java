package com.example.eta.scheduler;


import com.example.eta.dto.PushMessageDto;
import com.example.eta.exception.FailToSendPushNotificationException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class PushNotificationService {

    public void triggerPushNotification(String expoPushToken, String title, String body) throws FailToSendPushNotificationException {
        PushMessageDto pushMessageDto = PushMessageDto.builder()
                .to(expoPushToken)
                .title(title)
                .body(body)
                .build();

        ResponseEntity<String> responseEntity = WebClient.builder().baseUrl("https://exp.host/--/api/v2/push/send").build()
                .post()
                .body(Mono.just(pushMessageDto), PushMessageDto.class)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Accept-Encoding", "gzip, deflate")
                .retrieve().toEntity(String.class).block();

        JsonObject jsonObject = new JsonParser().parse(responseEntity.getBody()).getAsJsonObject();
        String status = jsonObject.getAsJsonObject("data").get("status").getAsString();
        if (!status.equals("ok")) {
            throw new FailToSendPushNotificationException(expoPushToken);
        }
    }
}
