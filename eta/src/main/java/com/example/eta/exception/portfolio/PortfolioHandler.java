package com.example.eta.exception.portfolio;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(value = Ordered.HIGHEST_PRECEDENCE)
public class PortfolioHandler {
    @ExceptionHandler(value = {NotEnoughCashException.class})
    protected ResponseEntity<Void> handleNotEnoughCashException(NotEnoughCashException e) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {CannotSellStockException.class})
    protected ResponseEntity<Void> handleCannotSellStockException(CannotSellStockException e) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
