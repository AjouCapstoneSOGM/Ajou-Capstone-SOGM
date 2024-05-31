package com.example.eta.controller;

import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.entity.User;
import com.example.eta.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/info")
public class UserInfoController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Map> getUserInfo(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String email = userPrincipal.getEmail();
        User user = userService.findByEmail(email);

        Map<String, Object> userInfo = new HashMap();
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("createdDate", user.getCreatedDate());
        userInfo.put("socialType", user.getSocialType());
        return ResponseEntity.ok(userInfo);
    }
}
