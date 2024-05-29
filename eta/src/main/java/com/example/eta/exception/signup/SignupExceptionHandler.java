package com.example.eta.exception.signup;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
@Order(value = Ordered.HIGHEST_PRECEDENCE)
public class SignupExceptionHandler {

    @ExceptionHandler(value = {EmailAlreadyExistsException.class})
    protected ResponseEntity<Map<String, String>> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = {MissingSignupAttemptException.class})
    protected ResponseEntity<Map<String, String>> handleMissingSignupAttemptException(MissingSignupAttemptException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {CodeVerificationFailedException.class})
    protected ResponseEntity<Map<String, String>> handleCodeVerificationFailedException(CodeVerificationFailedException e) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {CodeExpiredException.class})
    protected ResponseEntity<Map<String, String>> handleCodeExpiredException(CodeExpiredException e) {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = {SignupTokenVerificationFailedException.class})
    protected ResponseEntity<Map<String, String>> handleSignupTokenVerificationFailedException(SignupTokenVerificationFailedException e) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
