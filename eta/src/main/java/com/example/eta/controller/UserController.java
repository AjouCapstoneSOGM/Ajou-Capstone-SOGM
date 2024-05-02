package com.example.eta.controller;

import com.example.eta.dto.UserDto;
import com.example.eta.entity.User;
import com.example.eta.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController @Slf4j
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //유저 조회 기능
    @PatchMapping("/{id}")
    public UpdateUserResponse updateUserV2(
            @PathVariable("id") int id,
            @RequestBody @Valid UpdateUserRequest request) {

        UserDto.InfoDto userDto = new UserDto.InfoDto(
                request.getName(), request.getEmail(), request.getPassword()
        );
        userService.update(id, userDto);
        User findUser = userService.findOne(id);
        return new UpdateUserResponse(id, findUser.getName(), findUser.getEmail(), findUser.getPassword());

    }

    //멤버전체 조회 (현재 사용 안됩니다.)
    @GetMapping("/users")
    public List<User> membersV1() {
        return userService.findUsers();
    }


    //로그인 기능
    @PostMapping("/login")
    public ResponseEntity<LoginRequest.LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userService.authenticate(request.getEmail(), request.getPassword());
        log.info("여기까지");
        if (user != null) {
            return ResponseEntity.ok(new LoginRequest.LoginResponse(user.getUserId(), user.getEmail(), user.getName()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @Data
    static class CreateUserRequest{
        @NotEmpty
        private String name;
        private String email;
        private String password;
    }

    @Data
    static class CreateUserResponse{
        private int id;

        public CreateUserResponse(int id) {
            this.id = id;
        }
    }

    @Data
    static class UpdateUserRequest{
        private String name;
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    static class UpdateUserResponse{
        private int id;
        private String name;
        private String email;
        private String password;
    }

    @Data
    static class LoginRequest {
        private String email;
        private String password;

        @Data
        @AllArgsConstructor
        static class LoginResponse {
            private int userId;
            private String email;
            private String name;
        }


    /*@PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        log.info("register");
        try {
            User user = userService.registerNewUser(userDto);
            return ResponseEntity.ok().body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }*/
    }
}

