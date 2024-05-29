package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.example.eta.dto.TickerDto;
import com.example.eta.entity.Sector;
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

import java.util.ArrayList;
import java.util.List;
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
        Sector sector = new Sector();
        sector.setSectorName("IT");
        tickerEntity.setSector(sector);

        Value valueEntity = new Value();
        valueEntity.setRoe(10.5f);
        valueEntity.setRoa(5.2f);
        valueEntity.setPer(15.3f);
        valueEntity.setPbr(2.3f);
        valueEntity.setTwelveMonthRet(8.7f);

        List<Value> allValues = new ArrayList<>();
        allValues.add(valueEntity);

        Value valueWithNullFields = new Value();
        allValues.add(valueWithNullFields);

        when(tickerRepository.findById(tickerId)).thenReturn(Optional.of(tickerEntity));
        when(valueRepository.findFirstByTickerTickerOrderByScoreDateDesc(tickerId)).thenReturn(Optional.of(valueEntity));
        when(valueRepository.findBySectorName("IT")).thenReturn(allValues);

        TickerDto.TickerDetailDto result = tickerService.getTickerInfo(tickerId);

        assertNotNull(result);
        assertEquals("Sample Name", result.getName());
        assertEquals(tickerId, result.getTicker());
        assertEquals(10.5f*100, result.getRoe());
        assertEquals(5.2f*100, result.getRoa());
        assertEquals(15.3f*100, result.getPer());
        assertEquals(2.3f*100, result.getPbr());
        assertEquals(8.7f*100, result.getTwelveMonthRet());

        assertEquals(1, result.getRoeRank());
        assertEquals(1, result.getRoaRank());
        assertEquals(1, result.getPerRank());
        assertEquals(1, result.getPbrRank());
        assertEquals(1, result.getTwelveMonthRetRank());
        assertEquals(2, result.getTotal());
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
