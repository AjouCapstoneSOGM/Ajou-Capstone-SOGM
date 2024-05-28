package com.example.eta.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "sector")
public class Sector {

    @Id
    private String sectorId;

    @Column(nullable = false)
    private String sectorName;

    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PortfolioSector> portfolioSectors = new ArrayList<>();
}
