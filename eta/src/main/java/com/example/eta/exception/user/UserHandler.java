package com.example.eta.exception.user;

import com.example.eta.exception.authorization.NotFoundException;
import com.example.eta.exception.authorization.OwnershipException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(value = Ordered.HIGHEST_PRECEDENCE)
public class UserHandler {
    @ExceptionHandler(value = {UnmodifiableSocialUserException.class})
    protected ResponseEntity<Void> handleUnmodifiableSocialUserException(UnmodifiableSocialUserException e) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
