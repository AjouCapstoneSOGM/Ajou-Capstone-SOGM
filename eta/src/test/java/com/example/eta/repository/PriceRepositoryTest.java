package com.example.eta.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.example.eta.entity.Price;
import com.example.eta.entity.Ticker;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class PriceRepositoryTest {
    @Autowired
    private TickerRepository tickerRepository;

    @Autowired
    private PriceRepository priceRepository;

    @Test
    public void testFindLatestPriceByTicker() {
        Ticker ticker = tickerRepository.findById("005930").get();
        Price price = priceRepository.findLatestPriceByTicker(ticker.getTicker()).get();

        System.out.println(price.getDate());
        System.out.println(price.getClose());
        Assertions.assertAll(
                () -> assertEquals(ticker.getTicker(), price.getTicker().getTicker())
        );
    }
}
