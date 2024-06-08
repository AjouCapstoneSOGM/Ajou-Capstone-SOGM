package com.example.adminpage.service;

import com.example.adminpage.entity.User;
import com.example.adminpage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final MailService mailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @Transactional
    public void resetPassword(int userId, String tmpPassword) throws Exception{
        User user = userRepository.getReferenceById(userId);
        user.setPassword(passwordEncoder.encode(tmpPassword));
        mailService.sendMail(user.getEmail(), "eta 비밀번호 초기화", "<h3>아래 패스워드를 사용해 로그인하신 후 패스워드를 변경해 주세요. </h3><h1>" + tmpPassword + "</h1>");
    }

    @Transactional
    public void enableUser(int userId) {
        User user = userRepository.getReferenceById(userId);
        user.setEnabled(true);
        user.setModifiedDate(LocalDateTime.now());
    }

    @Transactional
    public void disableUser(int userId) {
        User user = userRepository.getReferenceById(userId);
        user.setEnabled(false);
        user.setModifiedDate(LocalDateTime.now());
    }
    public long getSocialUserCount() {
        return userRepository.countSocialUsers();
    }

    public long getRegularUserCount() {
        return userRepository.countRegularUsers();
    }
}
