package com.example.eta.controller;

import com.example.eta.dto.NewsDto;
import com.example.eta.dto.StockDto;
import com.example.eta.entity.Ticker;
import com.example.eta.service.NewsService;
import com.example.eta.service.StockService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.eta.util.Utility.decompose;

@RestController
@AllArgsConstructor
@RequestMapping("api/stocks")
public class StocksController {

    private final NewsService newsService;
    private final StockService stockService;

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
    public ResponseEntity<StockDto.StockInfoListDto> searchStocks(@RequestParam String text) {
        List<Ticker> tickers = stockService.getSearchedTicker(decompose(text));

        StockDto.StockInfoListDto stockInfoListDto = StockDto.StockInfoListDto.builder()
                .searchedList(tickers.stream()
                        .map(ticker -> StockDto.StockInfo.builder()
                                .ticker(ticker.getTicker())
                                .name(ticker.getName())
                                .exchange(ticker.getExchange())
                                .build())
                        .toList())
                .build();

        return ResponseEntity.ok(stockInfoListDto);
    }
}
