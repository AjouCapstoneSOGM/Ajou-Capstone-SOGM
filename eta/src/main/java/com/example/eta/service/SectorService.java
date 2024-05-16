package com.example.eta.service;

import com.example.eta.entity.Sector;
import com.example.eta.repository.SectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SectorService {

    private final SectorRepository sectorRepository;

    public Map<String, String> getAllSectors() {
        Map<String, String> sectors = new HashMap<>();
        for(Sector sector : sectorRepository.findAll()) {
            sectors.put(sector.getSectorId(), sector.getSectorName());
        }
        return sectors;
    }
}
