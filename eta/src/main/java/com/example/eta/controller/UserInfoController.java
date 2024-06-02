package com.example.eta.controller;

import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.entity.User;
import com.example.eta.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/info")
public class UserInfoController {

    private final UserService userService;

    @DeleteMapping
    public ResponseEntity<Void> deleteUserInfo(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        userService.deleteUser(user);
        return ResponseEntity.ok().build();
    }
}
