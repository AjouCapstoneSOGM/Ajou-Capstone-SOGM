package com.example.eta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Builder
@AllArgsConstructor
@Getter
public class PushMessageDto {

    @Builder
    @AllArgsConstructor
    @Getter
    public static class PushMessageData {
        private int pfId;
        private int rnId;
    }

    private String to;
    private String title;
    private String body;
    private PushMessageData data;
}

