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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @Slf4j
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signupv1")
    public CreateUserResponse saveMemberV1(@RequestBody @Valid User user) {
        Long id = userService.join(user);
        return new CreateUserResponse(id);

    }
//회원등록
    @PostMapping("/signup")
    public CreateUserResponse savaMemberV2(@RequestBody @Valid CreateUserRequest request) {
        log.info("createmember");
        User user = new User();
        user.setName(request.getName());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());

        Long id = userService.join(user);
        return new CreateUserResponse(id);

    }

    @PatchMapping("/{id}")
    public UpdateUserResponse updateUserV2(
            @PathVariable("id") Long id,
            @RequestBody @Valid UpdateUserRequest request) {

        UserDto userDto = new UserDto(
                request.getName(), request.getEmail(), request.getPassword()
        );
        userService.update(id, userDto);
        User findUser = userService.findOne(id);
        return new UpdateUserResponse(id, findUser.getName(), findUser.getEmail(), findUser.getPassword());

    }

    @GetMapping("/users")
    public List<User> membersV1() {
        return userService.findUsers();
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
        private Long id;

        public CreateUserResponse(Long id) {
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
        private Long id;
        private String name;
        private String email;
        private String password;
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
