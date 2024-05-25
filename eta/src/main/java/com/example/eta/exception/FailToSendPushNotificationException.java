package com.example.eta.exception;

public class FailToSendPushNotificationException extends RuntimeException {
    String expoPushToken;

    public FailToSendPushNotificationException(String expoPushToken) {
        this.expoPushToken = expoPushToken;
    }
}
