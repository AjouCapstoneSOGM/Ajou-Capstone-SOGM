package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.entity.Ticker;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class TickerServiceTest {

    @Autowired
    TickerService tickerService;

    @Test
    public void testGetTopTenKorPostfixedTickerBySector() {
        // when 티커 목록 가져오기
        List<String> postfixedTickers = tickerService.getTopTenKorPostfixedTickerBySector("G10");

        // then 10개
        Assertions.assertAll(
                () -> assertEquals(10, postfixedTickers.size())
        );
    }
}
