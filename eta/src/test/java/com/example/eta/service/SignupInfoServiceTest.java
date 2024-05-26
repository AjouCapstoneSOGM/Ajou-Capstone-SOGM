package com.example.eta.service;

import static org.junit.jupiter.api.Assertions.*;

import com.example.eta.entity.SignupInfo;
import com.example.eta.repository.SignupInfoRepository;
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
public class SignupInfoServiceTest {

    @Autowired
    private SignupInfoService signupInfoService;
    @Autowired
    private SignupInfoRepository signupInfoRepository;

    @Test
    @Transactional
    @DisplayName("미인증 이메일 정보 저장 테스트")
    public void testAddUnverifiedEmailInfo() {
        String email = "test@asdf.com";
        String code = signupInfoService.generateCode();

        signupInfoService.addUnverifiedEmailInfo(email, code);

        SignupInfo signupInfo = signupInfoRepository.getReferenceById(email);
        assertEquals(signupInfo.getEmail(), email);
        assertEquals(signupInfo.getCode(), code);
        assertTrue(signupInfo.getCodeExpires().isBefore(LocalDateTime.now().plusMinutes(5)));
        assertFalse(signupInfo.getIsVerified());
        assertNull(signupInfo.getSignupToken());
    }
}
