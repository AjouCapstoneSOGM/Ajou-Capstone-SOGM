package com.example.eta.controller;

import com.example.eta.scheduler.FcmMessaging;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Fcm 동작 확인을 위한 임시 컨트롤러
 */
@RestController
@AllArgsConstructor
@RequestMapping("api/fcm")
public class FcmController {

    @Builder
    @AllArgsConstructor
    static class FcmMessageDto {
        private String token;
        private String title;
        private String body;
    }

    private final FcmMessaging fcmMessaging;

    @PostMapping("/send")
    public ResponseEntity<Void> sendFcm(@RequestBody FcmMessageDto fcmMessageDto) throws IOException {
        fcmMessaging.triggerFcmMessage(fcmMessageDto.token, fcmMessageDto.title, fcmMessageDto.body);
        return ResponseEntity.ok().build();
    }
}
