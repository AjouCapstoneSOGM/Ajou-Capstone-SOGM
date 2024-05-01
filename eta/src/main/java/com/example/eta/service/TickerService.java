package com.example.eta.service;

import com.example.eta.entity.Ticker;
import com.example.eta.repository.TickerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TickerService {

    private final TickerRepository tickerRepository;

    /**
     * {@code sectorId}에 속하는 국내주식 티커 중 가치지표 기준 상위 10개의 티커명에
     * 코스피의 경우 <em>.KS</em>, 코스닥의 경우 <em>.KQ</em>를 postfix로 붙여서 반환
     */
    public List<String> getTopTenKorPostfixedTickerBySector(String sectorId) {
        List<Ticker> tickers = tickerRepository.findTopTickerBySector(sectorId, 10, "KOR");
        List<String> postfixedTickers = new ArrayList<>();
        for(Ticker ticker : tickers) {
            if (ticker.getExchange().equals("KOSPI")) {
                postfixedTickers.add(ticker.getTicker() + ".KS");
            }
            else if(ticker.getExchange().equals("KOSDAQ")) {
                postfixedTickers.add(ticker.getTicker() + ".KQ");
            }
        }
        return postfixedTickers;
    }
}
