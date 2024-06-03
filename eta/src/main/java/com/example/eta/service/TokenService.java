package com.example.eta.service;

import com.example.eta.entity.Token;
import com.example.eta.entity.User;
import com.example.eta.repository.TokenRepository;
import com.example.eta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;

    public void saveToken(User user, String expoPushToken) {
        // TODO: token DB에 jwt토큰을 저장하게 될 경우 코드 변경 필요
        tokenRepository.findById(user.getUserId())
            .ifPresentOrElse(
                token -> token.setExpoPushToken(expoPushToken),
                () -> {
                    Token token = tokenRepository.save(Token.builder()
                            .user(user)
                            .expoPushToken(expoPushToken)
                            .build());
                    user.setToken(token);
                }
            );
    }

    @Transactional
    public void deleteToken(User user) {
        tokenRepository.deleteById(user.getUserId());
        user.setToken(null);
    }
}
