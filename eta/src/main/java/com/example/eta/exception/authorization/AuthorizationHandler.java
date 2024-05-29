package com.example.eta.exception.authorization;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(value = Ordered.HIGHEST_PRECEDENCE)
public class AuthorizationHandler {
    @ExceptionHandler(value = {NotFoundException.class})
    protected ResponseEntity<Void> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {OwnershipException.class})
    protected ResponseEntity<Void> handleOwnershipException(OwnershipException e) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
