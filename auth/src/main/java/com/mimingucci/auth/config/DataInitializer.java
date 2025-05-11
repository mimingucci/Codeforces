package com.mimingucci.auth.config;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import com.mimingucci.auth.infrastructure.repository.jpa.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private final UserJpaRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        log.info("Initializing default users");
        createDefaultUsersIfNotExist();
    }

    private void createDefaultUsersIfNotExist() {
        // Create Super Admin if not exists
        if (!userRepository.existsByEmail("superadmin@codeforces.com")) {
            UserEntity superAdmin = new UserEntity();
            superAdmin.setId(1L);
            superAdmin.setEmail("superadmin@codeforces.com");
            superAdmin.setUsername("SuperAdmin");
            superAdmin.setPassword(passwordEncoder.encode("SuperAdmin123!"));
            superAdmin.setRoles(Set.of(Role.SUPER_ADMIN));
            superAdmin.setEnabled(true);
            superAdmin.setRating(0);
            superAdmin.setCreatedAt(Instant.now());
            
            userRepository.save(superAdmin);
            log.info("Created super admin user");
        }

        // Create Admin if not exists
        if (!userRepository.existsByEmail("admin@codeforces.com")) {
            UserEntity admin = new UserEntity();
            admin.setId(2L);
            admin.setEmail("admin@codeforces.com");
            admin.setUsername("Admin1");
            admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.setRoles(Set.of(Role.ADMIN));
            admin.setEnabled(true);
            admin.setRating(0);
            admin.setCreatedAt(Instant.now());
            
            userRepository.save(admin);
            log.info("Created admin user");
        }

        // Create Test User if not exists
        if (!userRepository.existsByEmail("user@codeforces.com")) {
            UserEntity user = new UserEntity();
            user.setId(3L);
            user.setEmail("user@codeforces.com");
            user.setUsername("TestUser");
            user.setPassword(passwordEncoder.encode("User123!"));
            user.setRoles(Set.of(Role.USER));
            user.setEnabled(true);
            user.setRating(0);
            user.setCreatedAt(Instant.now());
            
            userRepository.save(user);
            log.info("Created test user");
        }
    }
}