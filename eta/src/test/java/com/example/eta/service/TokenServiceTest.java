package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.entity.User;
import com.example.eta.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class TokenServiceTest {

    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("FCM 토큰 저장")
    @Transactional
    public void testSaveFcmToken() {
        User user = userRepository.save(User.builder()
                .email("james001@foo.bar")
                .isVerified(false)
                .password("password!")
                .name("James")
                .role("USER")
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        tokenService.saveFcmToken(user, "token1");
        assertEquals("token1", user.getToken().getFcmToken());

        tokenService.saveFcmToken(user, "token2");
        assertEquals("token2", user.getToken().getFcmToken());
    }

    @Test
    @DisplayName("FCM 토큰 삭제")
    @Transactional
    public void testDeleteFcmToken() {
        User user = userRepository.save(User.builder()
                .email("james001@foo.bar")
                .isVerified(false)
                .password("password!")
                .name("James")
                .role("USER")
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        tokenService.saveFcmToken(user, "token1");
        tokenService.deleteFcmToken(user);

        assertNull(user.getToken());
    }
}
