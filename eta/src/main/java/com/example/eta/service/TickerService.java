package com.example.eta.service;

import com.example.eta.dto.TickerDto;
import com.example.eta.entity.Ticker;
import com.example.eta.entity.Value;
import com.example.eta.repository.TickerRepository;
import com.example.eta.repository.ValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;

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

        List<Value> allValues = valueRepository.findBySectorName(String.valueOf(tickerEntity.getSector().getSectorName()));


        for (int i = 0; i < allValues.size(); i++) {
            if (allValues.get(i).getPer() == null) {
                allValues.get(i).setPer((float) -99);
            }
        }
        for (int i = 0; i < allValues.size(); i++) {
            if (allValues.get(i).getPbr() == null) {
                allValues.get(i).setPbr((float) -99);
            }
        }
        for (int i = 0; i < allValues.size(); i++) {
            if (allValues.get(i).getRoa() == null) {
                allValues.get(i).setRoa((float) -99);
            }
        }
        for (int i = 0; i < allValues.size(); i++) {
            if (allValues.get(i).getRoe() == null) {
                allValues.get(i).setRoe((float) -99);
            }
        }
        for (int i = 0; i < allValues.size(); i++) {
            if (allValues.get(i).getTwelveMonthRet() == null) {
                allValues.get(i).setTwelveMonthRet((float) -99);
            }
        }
        System.out.println("TickerService.getTickerInfo"+ (tickerEntity.getSector().getSectorName()));


        // 순위 계산
        int roeRank = calculateRank(allValues, Value::getRoe, value.getRoe());
        int roaRank = calculateRank(allValues, Value::getRoa, value.getRoa());
        int perRank = calculateRank(allValues, Value::getPer, value.getPer());
        int pbrRank = calculateRank(allValues, Value::getPbr, value.getPbr());
        int twelveMonthRetRank = calculateRank(allValues, Value::getTwelveMonthRet, value.getTwelveMonthRet());

        return TickerDto.TickerDetailDto.builder()
                .name(tickerEntity.getName())
                .ticker(tickerEntity.getTicker())
                .roe(Float.valueOf(Math.round(value.getRoe()*1000))/10)
                .roa(Float.valueOf(Math.round(value.getRoa()*1000))/10)
                .per(Float.valueOf(Math.round(value.getPer()*10))/10)
                .pbr(Float.valueOf(Math.round(value.getPbr()*10))/10)
                .twelveMonthRet(Float.valueOf(Math.round(value.getTwelveMonthRet()*1000))/10)
                .roeRank(roeRank)
                .roaRank(roaRank)
                .perRank(perRank)
                .pbrRank(pbrRank)
                .twelveMonthRetRank(twelveMonthRetRank)
                .total(allValues.size())
                .build();
    }

    private int calculateRank(List<Value> values, ToDoubleFunction<Value> valueExtractor, Float targetValue) {
        List<Value> sortedValues = values.stream()
                .sorted(Comparator.comparingDouble(valueExtractor).reversed())
                .toList();

        for (int i = 0; i < sortedValues.size(); i++) {
            if (valueExtractor.applyAsDouble(sortedValues.get(i)) == targetValue) {
                return i + 1;
            }
        }
        return -1;
    }
}
