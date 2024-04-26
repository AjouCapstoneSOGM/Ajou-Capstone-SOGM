package com.example.eta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sector")
public class Sector {

    @Id
    private String sectorId;

    @Column(nullable = false)
    private String name;
}
