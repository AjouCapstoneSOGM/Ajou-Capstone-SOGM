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

        // 모든 티커의 지표값을 조회
//        List<Value> allValues = valueRepository.findAll();


//        for (Value val : allValues) {
//            System.out.println("Value: " + val +
//                    ", ROE: " + val.getRoe() +
//                    ", ROA: " + val.getRoa() +
//                    ", PER: " + val.getPer() +
//                    ", PBR: " + val.getPbr() +
//                    ", 12MonthRet: " + val.getTwelveMonthRet());
//        }

        // 순위 계산
//        int roeRank = calculateRank(allValues, Value::getRoe, value.getRoe());
//        int roaRank = calculateRank(allValues, Value::getRoa, value.getRoa());
//        int perRank = calculateRank(allValues, Value::getPer, value.getPer());
//        int pbrRank = calculateRank(allValues, Value::getPbr, value.getPbr());
//        int twelveMonthRetRank = calculateRank(allValues, Value::getTwelveMonthRet, value.getTwelveMonthRet());

        return TickerDto.TickerDetailDto.builder()
                .name(tickerEntity.getName())
                .ticker(tickerEntity.getTicker())
                .roe(value.getRoe())
                .roa(value.getRoa())
                .per(value.getPer())
                .pbr(value.getPbr())
                .twelveMonthRet(value.getTwelveMonthRet())
//                .roeRank(roeRank)
//                .roaRank(roaRank)
//                .perRank(perRank)
//                .pbrRank(pbrRank)
//                .twelveMonthRetRank(twelveMonthRetRank)
                .build();
    }

//    private int calculateRank(List<Value> values, ToDoubleFunction<Value> valueExtractor, double targetValue) {
//        // null 값을 가진 항목들을 제외하고 순위를 매깁니다.
//        List<Value> sortedValues = values.stream()
//                .filter(val -> val != null && valueExtractor.applyAsDouble(val) != 0 && !Double.isNaN(valueExtractor.applyAsDouble(val))) // null 값 및 NaN 필터링
//                .sorted(Comparator.comparingDouble(valueExtractor).reversed())
//                .collect(Collectors.toList());
//
//        for (int i = 0; i < sortedValues.size(); i++) {
//            if (valueExtractor.applyAsDouble(sortedValues.get(i)) == targetValue) {
//                return i + 1; // 순위는 1부터 시작
//            }
//        }
//        return -1; // 에러 처리
//    }
}
