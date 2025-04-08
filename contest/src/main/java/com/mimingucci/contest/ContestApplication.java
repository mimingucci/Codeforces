package com.mimingucci.contest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableDiscoveryClient
@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties
public class ContestApplication {

	public static void main(String[] args) {
		SpringApplication.run(ContestApplication.class, args);
	}

}
