package com.example.adminpage.controller;

import com.example.adminpage.repository.PortfolioRepository;
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
    @Autowired
    private PortfolioRepository portfolioRepository;

    @GetMapping
    public String getUsers(Model model) {
        long socialUserCount = userService.getSocialUserCount();
        long regularUserCount = userService.getRegularUserCount();

        model.addAttribute("users", userRepository.findAll());
        model.addAttribute("totalUsers", userRepository.count());
        model.addAttribute("socialUserCount", socialUserCount);
        model.addAttribute("regularUserCount", regularUserCount);

        return "Users";
    }

    @GetMapping("/{userId}")
    public String getUser(@PathVariable("userId") int userId, Model model) {
        model.addAttribute("user", userRepository.getReferenceById(userId));
        model.addAttribute("portfolios", portfolioRepository.findAllByUserId(userId));
        return "UserDetail";
    }

    @GetMapping("/search/{searchType}/{query}")
    public String search(@PathVariable("searchType") String searchType, @PathVariable("query") String query, Model model) {
        switch (searchType) {
            case "email":
                model.addAttribute("users", userRepository.findAllByEmailContaining(query));
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
            redirectAttributes.addFlashAttribute("message",  "UserID " + userId + " 비밀번호 초기화 요청이 이메일로 전송되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "UserID " + userId + " 비밀번호 초기화 요청 실패");
        }
        return "redirect:/users";
    }

    @PostMapping("/enable")
    public String enableUser(@RequestParam("userId") int userId, RedirectAttributes redirectAttributes) {
        try {
            userService.enableUser(userId);
            redirectAttributes.addFlashAttribute("message", "UserID " + userId + " 사용자 활성화 성공");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "UserID " + userId + " 사용자 활성화 실패");
        }
        return "redirect:/users";
    }

    @PostMapping("/disable")
    public String disableUser(@RequestParam("userId") int userId, RedirectAttributes redirectAttributes) {
        try {
            userService.disableUser(userId);
            redirectAttributes.addFlashAttribute("message", "UserID " + userId + " 사용자 비활성화 성공");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "UserID " + userId + " 사용자 비활성화 실패");
        }
        return "redirect:/users";
    }
}