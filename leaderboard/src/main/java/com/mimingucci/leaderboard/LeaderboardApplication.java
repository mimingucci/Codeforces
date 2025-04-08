package com.mimingucci.leaderboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class LeaderboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(LeaderboardApplication.class, args);
	}

}
