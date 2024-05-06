package com.example.eta.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PortfolioScheduler {

    @Scheduled(cron = "0 0 0 * * 1-5")
    public void createRebalancingNotification() {

    }

}
