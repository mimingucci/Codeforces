package com.mimingucci.testcase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class TestcaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestcaseApplication.class, args);
	}

}
