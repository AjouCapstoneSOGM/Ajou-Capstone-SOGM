package com.example.eta.service;

import com.example.eta.dto.RecordDto;
import com.example.eta.entity.PortfolioRecord;
import com.example.eta.repository.PortfolioRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioRecordService {

    private final PortfolioRecordRepository portfolioRecordRepository;

    public List<RecordDto.PortfolioRecordGroupedDto> getGroupedPortfolioRecords(Integer pfId) {
        List<PortfolioRecord> records = portfolioRecordRepository.findAllByPortfolioPfId(pfId); // 해당 포트폴리오의 기록 조회

        Map<LocalDate, List<PortfolioRecord>> groupedByDate = records.stream()
                .collect(Collectors.groupingBy(record -> record.getRecordDate().toLocalDate()));

        List<RecordDto.PortfolioRecordGroupedDto> result = new ArrayList<>();
        for (Map.Entry<LocalDate, List<PortfolioRecord>> entry : groupedByDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<RecordDto.PortfolioRecordDto> recordDtos = entry.getValue().stream()
                    .map(record -> new RecordDto.PortfolioRecordDto(
                            record.getTicker().getTicker(),
                            record.getNumber(),
                            record.getPrice(),
                            record.isBuy()
                    ))
                    .collect(Collectors.toList());

            result.add(new RecordDto.PortfolioRecordGroupedDto(date, recordDtos));
        }

        return result;
    }
}
