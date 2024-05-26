package com.example.eta.auth.service;

import com.example.eta.entity.User;
import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            String email = username;
            User user = userRepository.findByEmail(email).get();
            if (user == null) {
                throw new UsernameNotFoundException("Can not find username.");
            }
            return UserPrincipal.create(user);
        }
}
