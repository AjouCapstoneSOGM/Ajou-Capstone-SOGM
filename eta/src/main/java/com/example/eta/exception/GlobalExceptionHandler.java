package com.example.eta.exception;

import com.example.eta.scheduler.PortfolioScheduler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Order(value = Ordered.LOWEST_PRECEDENCE)
public class GlobalExceptionHandler {

    private Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(value = {AuthenticationException.class})
    protected ResponseEntity<Void> handleAuthenticationException(AuthenticationException e) {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = {NotFoundException.class})
    protected ResponseEntity<Void> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {OwnershipException.class})
    protected ResponseEntity<Void> handleOwnershipException(OwnershipException e) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {FailToSendPushNotificationException.class})
    protected ResponseEntity<Void> handleFailToSendPushNotificationException(FailToSendPushNotificationException e) {
        logger.error("Fail to send push notification for expoPushToken: " + e.expoPushToken);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = {MailSendException.class})
    protected ResponseEntity<Void> handleMailSendException(MailSendException e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = {Exception.class})
    protected ResponseEntity<Void> handleException(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

