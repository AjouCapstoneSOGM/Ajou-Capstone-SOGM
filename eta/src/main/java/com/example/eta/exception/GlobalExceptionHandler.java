package com.example.eta.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = {EmailAlreadyExistsException.class})
    protected ResponseEntity<Object> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message", e.getMessage());
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {AuthenticationException.class})
    protected ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException e) {
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message", "계정 정보가 일치하지 않습니다.");
        return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);
    }
}

