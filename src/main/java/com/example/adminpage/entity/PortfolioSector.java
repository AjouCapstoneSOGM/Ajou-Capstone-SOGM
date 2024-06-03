package com.example.adminpage.entity;

import com.example.adminpage.entity.compositekey.PortfolioSectorId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(PortfolioSectorId.class)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "portfolio_sector")
public class PortfolioSector {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pf_id")
    private Portfolio portfolio;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;
}
