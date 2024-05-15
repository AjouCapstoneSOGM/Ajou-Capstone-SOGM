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
    protected ResponseEntity<Map<String, String>> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(responseData);
    }

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

    @ExceptionHandler(value = {Exception.class})
    protected ResponseEntity<Void> handleException(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

