package com.example.eta.service;

import com.example.eta.entity.SignupInfo;
import com.example.eta.exception.signup.*;
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

    static final int SIGNUP_TOKEN_LENGTH = 16;

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

    @Transactional
    public String verifyCodeAndIssueSignupToken(String email, String code) {
        if (!signupInfoRepository.existsById(email)) {
            throw new MissingSignupAttemptException();
        }

        SignupInfo signupInfo = signupInfoRepository.findById(email).get();
        if (signupInfo.getCodeExpires().isBefore(LocalDateTime.now())) {
            throw new CodeExpiredException();
        }
        if (!signupInfo.getCode().equals(code)) {
            throw new CodeVerificationFailedException();
        }
        if (signupInfo.getIsVerified()) {
            return signupInfo.getSignupToken();
        }

        signupInfo.setIsVerified(true);
        String signupToken = generateSignupToken();
        signupInfo.setSignupToken(signupToken);
        return signupToken;
    }

    public SignupInfo verifySignupToken(String email, String signupToken) {
        if (!signupInfoRepository.existsById(email)) {
            throw new MissingSignupAttemptException();
        }

        SignupInfo signupInfo = signupInfoRepository.findById(email).get();

        if(!signupInfo.getSignupToken().equals(signupToken)) {
            throw new SignupTokenVerificationFailedException();
        }

        return signupInfo;
    }

    public void deleteSignupInfo(SignupInfo signupInfo) {
        signupInfoRepository.delete(signupInfo);
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

    public String generateCode() {
        return String.format("%06d", (int) (Math.random() * (1000000)));
    }

    public String generateSignupToken(){
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < SIGNUP_TOKEN_LENGTH; i++) {
            int random = (int) (Math.random() * 3);
            switch (random) {
                case 0:
                    stringBuilder.append((char) ((int) (Math.random() * 26) + 65));
                    break;
                case 1:
                    stringBuilder.append((char) ((int) (Math.random() * 26) + 97));
                    break;
                case 2:
                    stringBuilder.append((int) (Math.random() * 10));
                    break;
            }
        }
        return stringBuilder.toString();
    }
}
