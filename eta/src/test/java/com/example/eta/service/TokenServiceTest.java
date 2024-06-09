package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.entity.User;
import com.example.eta.enums.RoleType;
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
    @DisplayName("expo 토큰 저장")
    @Transactional
    public void testSaveFcmToken() {
        User user = userRepository.save(User.builder()
                .email("suprlux09@ajou.ac.kr")
                .password("password!")
                .name("James")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        tokenService.saveToken(user, "token1");
        assertEquals("token1", user.getToken().getExpoPushToken());

        tokenService.saveToken(user, "token2");
        assertEquals("token2", user.getToken().getExpoPushToken());
    }

    @Test
    @DisplayName("expo 토큰 삭제")
    @Transactional
    public void testDeleteFcmToken() {
        User user = userRepository.save(User.builder()
                .email("suprlux09@ajou.ac.kr")
                .password("password!")
                .name("James")
                .roleType(RoleType.ROLE_USER)
                .createdDate(LocalDateTime.now())
                .enabled(true).build());

        tokenService.saveToken(user, "token1");
        tokenService.deleteToken(user);

        assertNull(user.getToken());
    }
}
