package com.mimingucci.user.security;

import com.mimingucci.user.entities.User;
import com.mimingucci.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public class CodeforcesUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = this.userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("Could not find user with email: " + email);
        }
        return new CodeforcesUserDetails(user.get());
    }
}
