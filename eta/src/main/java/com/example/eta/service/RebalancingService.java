package com.example.eta.service;

import com.example.eta.entity.RebalancingTicker;
import com.example.eta.repository.RebalancingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RebalancingService {
    RebalancingRepository rebalancingRepository;

    // 포트폴리오 ID로 리밸런싱 알림 존재 여부 확인
    public boolean existsRebalancingByPortfolioId(Integer pfId) {
        return rebalancingRepository.existsByPortfolioPfId(pfId);
    }

    // 포트폴리오 ID로 모든 리밸런싱 알림 받아오기
    public List<RebalancingTicker> findAllRebalancingByPortfolioId(Integer pfId) {
        return rebalancingRepository.findByPortfolioPfId(pfId);
    }
    // 알림 ID로 리밸린성 알림 삭제
    public void deleteRebalancing(Integer rnId) throws Exception {
        if (!rebalancingRepository.existsById(rnId)) {
            throw new Exception("Rebalancing notification not found with id: " + rnId);
        }
        rebalancingRepository.deleteById(rnId);
    }


}
