package com.example.eta.service;

import static com.example.eta.util.Utility.decompose;
import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.entity.Ticker;
import org.junit.jupiter.api.DisplayName;
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
    private TickerService tickerService;

    @Test
    @DisplayName("문자열에 대한 종목 검색")
    public void testSearchTickers() throws Exception {
        String decomposedText = "ㅅㅏ";
        List<Ticker> tickers = tickerService.getSearchedTicker(decomposedText);
        for (Ticker ticker : tickers) {
            assertTrue(decompose(ticker.getName()).contains(decomposedText) || ticker.getTicker().contains(decomposedText));
        }
    }
}
