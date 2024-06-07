package com.example.adminpage.service;

import com.example.adminpage.repository.PortfolioSectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioSectorService {

    @Autowired
    private PortfolioSectorRepository portfolioSectorRepository;

    public Map<String, Long> getPortfoliosCountBySector() {
        List<Object[]> results = portfolioSectorRepository.countPortfoliosBySector();
        Map<String, Long> portfoliosCountBySector = new HashMap<>();
        for (Object[] result : results) {
            String sectorId = (String) result[0];
            Long count = (Long) result[1];
            portfoliosCountBySector.put(sectorId, count);
        }
        return portfoliosCountBySector;
    }
}
