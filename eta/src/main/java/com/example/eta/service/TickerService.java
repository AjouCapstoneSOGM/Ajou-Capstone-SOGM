package com.example.eta.service;

import com.example.eta.entity.Ticker;
import com.example.eta.repository.TickerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TickerService {

    private final TickerRepository tickerRepository;

    public List<Ticker> getSearchedTicker(String decomposedText) {
        return tickerRepository.findTopTickerByDecomposedText(decomposedText, 20);
    }
}
