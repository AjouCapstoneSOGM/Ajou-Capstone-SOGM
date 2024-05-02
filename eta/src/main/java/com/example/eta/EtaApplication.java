package com.example.eta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class EtaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EtaApplication.class, args);
	}

}
