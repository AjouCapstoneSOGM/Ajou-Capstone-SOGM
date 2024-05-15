package com.example.eta.service;

import com.example.eta.entity.Token;
import com.example.eta.entity.User;
import com.example.eta.repository.TokenRepository;
import com.example.eta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;

    public void saveFcmToken(User user, String fcmToken) {
        // TODO: token DB에 jwt토큰을 저장하게 될 경우 코드 변경 필요
        tokenRepository.findById(user.getUserId())
            .ifPresentOrElse(
                token -> token.setFcmToken(fcmToken),
                () -> {
                    Token token = tokenRepository.save(Token.builder()
                            .user(user)
                            .fcmToken(fcmToken)
                            .build());
                    user.setToken(token);
                }
            );
    }

    public void deleteFcmToken(User user) {
        tokenRepository.deleteById(user.getUserId());
        user.setToken(null);
    }
}
