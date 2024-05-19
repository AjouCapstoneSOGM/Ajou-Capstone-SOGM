package com.example.eta.controller;

import com.example.eta.dto.NewsDto;
import com.example.eta.dto.TickerDto;
import com.example.eta.entity.Ticker;
import com.example.eta.service.NewsService;
import com.example.eta.service.TickerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.eta.util.Utility.decompose;

@RestController
@AllArgsConstructor
@RequestMapping("api/ticker")
public class TickerController {

    private final NewsService newsService;
    private final TickerService tickerService;

    @GetMapping("/{ticker}/news")
    public ResponseEntity<NewsDto> getNews(@PathVariable String ticker) {
        NewsDto newsDto = newsService.getNews(ticker);
        if (newsDto != null) {
            return ResponseEntity.ok(newsDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<TickerDto.TickerInfoListDto> searchStocks(@RequestParam String text) {
        List<Ticker> tickers = tickerService.getSearchedTicker(decompose(text));

        TickerDto.TickerInfoListDto tickerInfoListDto = TickerDto.TickerInfoListDto.builder()
                .searchedList(tickers.stream()
                        .map(ticker -> TickerDto.TickerInfo.builder()
                                .ticker(ticker.getTicker())
                                .name(ticker.getName())
                                .exchange(ticker.getExchange())
                                .build())
                        .toList())
                .build();

        return ResponseEntity.ok(tickerInfoListDto);
    }
}
