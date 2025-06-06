package com.mimingucci.auth.config;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import com.mimingucci.auth.infrastructure.repository.jpa.UserJpaRepository;
import com.mimingucci.auth.infrastructure.util.IdGenerator;
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
            superAdmin.setId(IdGenerator.INSTANCE.nextId());
            superAdmin.setEmail("superadmin@codeforces.com");
            superAdmin.setUsername("SuperAdmin");
            superAdmin.setPassword(passwordEncoder.encode("superadmin"));
            superAdmin.setRoles(Set.of(Role.SUPER_ADMIN));
            superAdmin.setEnabled(true);
            superAdmin.setCreatedAt(Instant.now());
            superAdmin.setRating(0);
            
            userRepository.save(superAdmin);
            log.info("Created super admin user");
        }

        // Create Admin if not exists
        if (!userRepository.existsByEmail("admin@codeforces.com")) {
            UserEntity admin = new UserEntity();
            admin.setId(IdGenerator.INSTANCE.nextId());
            admin.setEmail("admin@codeforces.com");
            admin.setUsername("Admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRoles(Set.of(Role.ADMIN));
            admin.setEnabled(true);
            admin.setRating(0);
            admin.setCreatedAt(Instant.now());
            
            userRepository.save(admin);
            log.info("Created admin user");
        }

        for (int i = 1; i <= 100; i++) {
            // Create Test User if not exists
            if (!userRepository.existsByEmail("testuser" + i + "@codeforces.com")) {
                UserEntity user = new UserEntity();
                user.setId(IdGenerator.INSTANCE.nextId());
                user.setEmail("testuser" + i + "@codeforces.com");
                user.setUsername("TestUser" + i);
                user.setPassword(passwordEncoder.encode("user"));
                user.setRoles(Set.of(Role.USER));
                user.setEnabled(true);
                user.setRating(0);
                user.setCreatedAt(Instant.now());

                userRepository.save(user);
                log.info("Created test user");
            }
        }
    }
}