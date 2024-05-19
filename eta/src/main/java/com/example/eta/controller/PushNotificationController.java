package com.example.eta.controller;

import com.example.eta.dto.PushMessageDto;
import com.example.eta.scheduler.PushNotificationService;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@RequestMapping("api/push")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;

    @PostMapping("/send")
    public ResponseEntity<Void> sendPushNotification(@RequestBody PushMessageDto pushMessageDto){
        pushNotificationService.triggerPushNotification(pushMessageDto.getTo(), pushMessageDto.getTitle(), pushMessageDto.getBody());
        return ResponseEntity.ok().build();
    }
}
