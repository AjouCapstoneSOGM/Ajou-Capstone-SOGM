package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.example.eta.dto.TickerDto;
import com.example.eta.entity.Ticker;
import com.example.eta.entity.Value;
import com.example.eta.repository.TickerRepository;
import com.example.eta.repository.ValueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class TickerServiceTest {

    @Mock
    private TickerRepository tickerRepository;

    @Mock
    private ValueRepository valueRepository;

    @InjectMocks
    private TickerService tickerService;

    @Test
    void testGetTickerInfo_Success() {
        String tickerId = "005930";
        Ticker tickerEntity = new Ticker();
        tickerEntity.setName("Sample Name");
        tickerEntity.setTicker(tickerId);

        Value valueEntity = new Value();
        valueEntity.setRoe(10.5f);
        valueEntity.setPer(15.3f);

        when(tickerRepository.findById(tickerId)).thenReturn(Optional.of(tickerEntity));
        when(valueRepository.findFirstByTickerTickerOrderByScoreDateDesc(tickerId)).thenReturn(Optional.of(valueEntity));

        TickerDto.TickerDetailDto result = tickerService.getTickerInfo(tickerId);

        assertNotNull(result);
        assertEquals("Sample Name", result.getName());
        assertEquals(tickerId, result.getTicker());
        assertEquals(10.5f, result.getRoe());
        assertEquals(15.3f, result.getPer());
    }

    @Test
    void testGetTickerInfo_TickerNotFound() {
        String tickerId = "005930";
        when(tickerRepository.findById(tickerId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            tickerService.getTickerInfo(tickerId);
        });
        assertEquals("Ticker not found", exception.getMessage());
    }

    @Test
    void testGetTickerInfo_ValueNotFound() {
        // Arrange
        String tickerId = "005930";
        Ticker tickerEntity = new Ticker();
        tickerEntity.setName("Sample Name");
        tickerEntity.setTicker(tickerId);

        when(tickerRepository.findById(tickerId)).thenReturn(Optional.of(tickerEntity));
        when(valueRepository.findFirstByTickerTickerOrderByScoreDateDesc(tickerId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            tickerService.getTickerInfo(tickerId);
        });
        assertEquals("Value not found", exception.getMessage());
    }

}
