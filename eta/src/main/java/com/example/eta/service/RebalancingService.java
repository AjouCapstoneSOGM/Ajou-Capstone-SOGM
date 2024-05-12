package com.example.eta.service;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.entity.Ticker;
import com.example.eta.repository.RebalancingRepository;
import com.example.eta.repository.TickerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RebalancingService {
    private final TickerRepository tickerRepository;
    private final RebalancingRepository rebalancingRepository;

    // 포트폴리오 ID로 리밸런싱 알림 존재 여부 확인
    public boolean existsRebalancingByPortfolioId(Integer pfId) {
        return rebalancingRepository.existsByPortfolioPfId(pfId);
    }

    // 알림 ID로 리밸린성 알림 삭제
    public void deleteRebalancing(Integer rnId) throws Exception {
        if (!rebalancingRepository.existsById(rnId)) {
            throw new Exception("Rebalancing notification not found with id: " + rnId);
        }
        rebalancingRepository.deleteById(rnId);
    }

    // 포트폴리오 ID로 모든 리밸런싱 알림 받아오기
    public List<RebalancingDto.InfoDto> getAllRebalancingsByPortfolioId(Integer pfId) {
        List<RebalancingDto.InfoDto> rebalancings = new ArrayList<>();
        List<RebalancingTicker> rebalancingTickers = rebalancingRepository.findByPortfolioPfId(pfId);
        for (RebalancingTicker rt : rebalancingTickers) {
            Optional<Ticker> ticker = tickerRepository.findById(rt.getTicker().getTicker());
            ticker.ifPresent(value -> rebalancings.add(new RebalancingDto.InfoDto(
                    value.getTicker(),
                    value.getName(),
                    rt.getNumber(),
                    rt.getIsBuy()
            )));
        }
        return rebalancings;
    }
}
