package com.example.eta.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = {EmailAlreadyExistsException.class})
    protected ResponseEntity<Object> handleBusinessException(EmailAlreadyExistsException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {AuthenticationException.class})
    protected ResponseEntity<Object> handleAuthenticationException(AuthenticationException e) {
        return new ResponseEntity<>("계정 정보가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
    }
}

