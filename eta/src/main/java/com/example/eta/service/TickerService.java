package com.example.eta.service;

import com.example.eta.dto.TickerDto;
import com.example.eta.entity.Ticker;
import com.example.eta.entity.Value;
import com.example.eta.repository.TickerRepository;
import com.example.eta.repository.ValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TickerService {

    private final TickerRepository tickerRepository;
    private final ValueRepository valueRepository;

    public List<Ticker> getSearchedTicker(String decomposedText) {
        return tickerRepository.findTickersByDecomposedText(decomposedText, 20);
    }

    public TickerDto.TickerDetailDto getTickerInfo(String ticker) {
        Ticker tickerEntity = tickerRepository.findById(ticker)
                .orElseThrow(() -> new IllegalArgumentException("Ticker not found"));

        Value value = valueRepository.findFirstByTickerTickerOrderByScoreDateDesc(ticker)
                .orElseThrow(() -> new IllegalArgumentException("Value not found"));

        return new TickerDto.TickerDetailDto(
                tickerEntity.getName(),
                tickerEntity.getTicker(),
                value.getRoe(),
                value.getPer()
        );
    }
}
