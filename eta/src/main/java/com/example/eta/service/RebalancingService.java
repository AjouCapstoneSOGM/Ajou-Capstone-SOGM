package com.example.eta.service;

import com.example.eta.dto.RebalancingDto;
import com.example.eta.entity.Portfolio;
import com.example.eta.entity.Rebalancing;
import com.example.eta.entity.RebalancingTicker;
import com.example.eta.entity.Ticker;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.RebalancingRepository;
import com.example.eta.repository.TickerRepository;
import com.example.eta.scheduler.PortfolioScheduler;
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
    private final PortfolioRepository portfolioRepository;
    private final PortfolioScheduler portfolioScheduler;

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
    public List<RebalancingDto.RebalancingListDto> getAllRebalancingsByPortfolioId(Integer pfId) {

        List<Rebalancing> rebalancings = rebalancingRepository.findByPortfolioPfId(pfId);
        List<RebalancingDto.RebalancingListDto> rebalancingListDtos = new ArrayList<>();
        for (Rebalancing rebalancing : rebalancings) {
            int rnId = rebalancing.getRnId();
            List<RebalancingDto.RebalancingInfo> rebalancingInfos = new ArrayList<>();
            for (RebalancingTicker rebalancingTicker : rebalancing.getRebalancingTickers()) {
                Optional<Ticker> ticker = tickerRepository.findById(rebalancingTicker.getTicker().getTicker());
                ticker.ifPresent(value -> rebalancingInfos.add(new RebalancingDto.RebalancingInfo(
                        value.getTicker(),
                        value.getName(),
                        rebalancingTicker.getNumber(),
                        rebalancingTicker.getIsBuy()
                )));
            }
            rebalancingListDtos.add(RebalancingDto.RebalancingListDto.builder()
                    .rnId(rnId)
                    .rebalancings(rebalancingInfos)
                    .build());
        }

        return rebalancingListDtos;
    }

    public int executeRebalancingAndGetNotificationId(int pfId) {
        Portfolio portfolio = portfolioRepository.findById(pfId).get();

        portfolioScheduler.updateProportion(portfolio);
        if(portfolioScheduler.isProportionRebalancingNeeded(portfolio)) {
            return portfolioScheduler.createProportionRebalancing(portfolio);
        }
        else return -1;
    }
}
