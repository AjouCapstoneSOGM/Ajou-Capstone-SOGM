package com.example.eta.service;

import com.example.eta.dto.RecordDto;
import com.example.eta.entity.PortfolioRecord;
import com.example.eta.repository.PortfolioRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioRecordService {

    private final PortfolioRecordRepository portfolioRecordRepository;

    @Transactional
    public List<RecordDto.PortfolioRecordGroupedDto> getGroupedPortfolioRecords(Integer pfId) {
        List<PortfolioRecord> records = portfolioRecordRepository.findAllByPortfolioPfId(pfId);

        Map<LocalDateTime, List<PortfolioRecord>> groupedByDate = records.stream()
                .collect(Collectors.groupingBy(PortfolioRecord::getRecordDate));

        List<RecordDto.PortfolioRecordGroupedDto> result = new ArrayList<>();
        for (Map.Entry<LocalDateTime, List<PortfolioRecord>> entry : groupedByDate.entrySet()) {
            LocalDateTime date = entry.getKey();
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
