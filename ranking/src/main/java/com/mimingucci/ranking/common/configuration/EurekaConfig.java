package com.mimingucci.ranking.common.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.commons.util.InetUtils;
import org.springframework.cloud.netflix.eureka.EurekaInstanceConfigBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
@Profile("docker")
public class EurekaConfig {

    @Value("${spring.application.name}")
    private String appName;

    @Bean
    public EurekaInstanceConfigBean eurekaInstanceConfig(InetUtils inetUtils) {
        EurekaInstanceConfigBean config = new EurekaInstanceConfigBean(inetUtils);
        config.setPreferIpAddress(false);
        config.setNonSecurePort(8089);
        config.setHostname("ranking");
        config.setInstanceId("ranking:8089");
        config.setAppname("RANKING");
        config.setVirtualHostName("ranking");
        config.setSecureVirtualHostName("ranking");

        // For debugging
        try {
            String hostName = InetAddress.getLocalHost().getHostName();
            String ipAddr = InetAddress.getLocalHost().getHostAddress();
            config.setHostname(hostName);
            config.setIpAddress(ipAddr);
        } catch (UnknownHostException e) {
            // Ignore
        }

        return config;
    }
}
