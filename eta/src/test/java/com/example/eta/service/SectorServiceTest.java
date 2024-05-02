package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.repository.SectorRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class SectorServiceTest {

    @Autowired
    private SectorService sectorService;

    @Test
    @DisplayName("섹터 목록 가져오기")
    @Transactional
    public void testGetAllSectors() throws Exception {
        // when 섹터 목록 가져오기
        Map<String, String> sectors = sectorService.getAllSectors();

        // then 목록 제대로 가져왔는지
        Assertions.assertAll(
                () -> assertEquals(sectors.size(), 10),
                () -> assertEquals(sectors.get("G10"), "에너지")
        );
    }

}
