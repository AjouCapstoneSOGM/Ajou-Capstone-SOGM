package com.example.eta.entity.compositekey;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PriceId implements Serializable {
    private LocalDateTime date;
    private String ticker;
}
