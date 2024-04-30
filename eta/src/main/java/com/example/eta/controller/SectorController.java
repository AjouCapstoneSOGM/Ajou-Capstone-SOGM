package com.example.eta.controller;

import com.example.eta.service.SectorService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/sector")
public class SectorController {

    private final SectorService sectorService;

    @GetMapping("/list")
    public ResponseEntity<Object> getAllSector() {
        return new ResponseEntity<>(sectorService.getAllSectors(), HttpStatus.OK);
    }
}
