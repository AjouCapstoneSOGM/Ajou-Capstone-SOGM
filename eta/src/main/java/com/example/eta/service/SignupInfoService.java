package com.example.eta.service;

import com.example.eta.entity.SignupInfo;
import com.example.eta.exception.EmailAlreadyExistsException;
import com.example.eta.repository.SignupInfoRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SignupInfoService {

    @Value("${spring.mail.username}")
    private String senderEmail;

    private final JavaMailSender javaMailSender;
    private final UserService userService;
    private final SignupInfoRepository signupInfoRepository;

    @Transactional
    public void addUnverifiedEmailInfo(String email, String code) {
        if (userService.isExistEmail(email)) {
            throw new EmailAlreadyExistsException();
        }

        if (signupInfoRepository.existsById(email)) {
            signupInfoRepository.deleteById(email);
        }

        SignupInfo signupInfo = SignupInfo.builder()
                .email(email)
                .code(code)
                .codeExpires(LocalDateTime.now().plusMinutes(5))
                .isVerified(false)
                .build();
        signupInfoRepository.save(signupInfo);
    }

    public String generateCode() {
        return String.format("%06d", (int) (Math.random() * (1000000)));
    }

    public void sendVerificationEmail(String email, String code) throws Exception {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO, email);
        message.setSubject("eta 인증 번호");
        String body = "";
        body += "<h3>" + "아래 인증 번호를 입력해서 이메일을 인증하십시오." + "</h3>";
        body += "<h1>" + code + "</h1>";
        message.setText(body,"UTF-8", "html");
        javaMailSender.send(message);
    }
}
