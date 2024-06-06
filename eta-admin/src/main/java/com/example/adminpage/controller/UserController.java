package com.example.adminpage.controller;

import com.example.adminpage.repository.UserRepository;
import com.example.adminpage.service.UserService;
import com.example.adminpage.util.Utility;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public String getUsers(Model model) {
        model.addAttribute("users", userRepository.findAll());
        return "Users";
    }

    @GetMapping("/search/{searchType}/{query}")
    public String search(@PathVariable("searchType") String searchType, @PathVariable("query") String query, Model model) {
        switch (searchType) {
            case "id":
//                model.addAttribute("users", userRepository.findAllByUserId(Integer.parseInt(query)));
                userRepository.findAllByUserId(Integer.parseInt(query)).ifPresent(user -> model.addAttribute("users", user));
                System.out.println("UserController.user"+model);
                break;
            case "name":
                model.addAttribute("users", userRepository.findAllByNameContaining(query));
                break;
            default:
        }
        System.out.println("UserController.user*******"+model);
        return "Users";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam("userId") int userId, RedirectAttributes redirectAttributes) {
        String tmpPassword = Utility.generateRandomString();
        try {
            userService.resetPassword(userId, tmpPassword);
            redirectAttributes.addFlashAttribute("message",  "UserID" + userId + " 비밀번호 초기화 요청이 이메일로 전송되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "UserID" + userId + " 비밀번호 초기화 요청 실패");
        }
        return "redirect:/users";
    }

    @PostMapping("/enable")
    public String enableUser(@RequestParam("userId") int userId, RedirectAttributes redirectAttributes) {
        try {
            userService.enableUser(userId);
            redirectAttributes.addFlashAttribute("message", "UserID" + userId + " 사용자 활성화 성공");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "UserID" + userId + " 사용자 활성화 실패");
        }
        return "redirect:/users";
    }

    @PostMapping("/disable")
    public String disableUser(@RequestParam("userId") int userId, RedirectAttributes redirectAttributes) {
        try {
            userService.disableUser(userId);
            redirectAttributes.addFlashAttribute("message", "UserID" + userId + " 사용자 비활성화 성공");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "UserID" + userId + " 사용자 비활성화 실패");
        }
        return "redirect:/users";
    }
}