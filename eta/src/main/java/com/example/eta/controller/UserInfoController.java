package com.example.eta.controller;

import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.entity.User;
import com.example.eta.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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


    @PutMapping("/name")
    public ResponseEntity updateName(@RequestBody Map<String, String> requestBody, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String email = userPrincipal.getEmail();
        userService.updateName(email, requestBody.get("name"));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/password")
    public ResponseEntity updatePassword(@RequestBody Map<String, String> requestBody, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String email = userPrincipal.getEmail();
        userService.updatePassword(email, requestBody.get("password"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUserInfo(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        userService.deleteUser(user);
        return ResponseEntity.ok().build();
    }
}
