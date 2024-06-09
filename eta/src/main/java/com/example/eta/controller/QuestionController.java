package com.example.eta.controller;

import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.entity.Question;
import com.example.eta.entity.User;
import com.example.eta.service.QuestionService;
import com.example.eta.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("api/question")
public class QuestionController {

    static class Dto {
        @Builder
        @Getter
        static class QuestionInfo {
            String title;
            String content;
        }

        @Builder
        @Getter
        static class QuestionDetail {
            String title;
            String content;
            String answer;
            LocalDateTime createdDate;
            LocalDateTime answeredDate;
        }

        @Builder
        @Getter
        static class QuestionPreview {
            String title;
            LocalDateTime createdDate;
            boolean answered;
        }

        @Builder
        @Getter
        static class QuestionList {
            List<QuestionPreview> questions;
        }
    }

    private final UserService userService;
    private final QuestionService questionService;

    @GetMapping("/list")
    public ResponseEntity<Dto.QuestionList> getQuestionList(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        List<Dto.QuestionPreview> questions = questionService.findAllByUser(user).stream().map(question -> {
            return Dto.QuestionPreview.builder()
                    .title(question.getTitle())
                    .createdDate(question.getCreatedDate())
                    .answered(question.getAnsweredDate() != null)
                    .build();
        }).collect(Collectors.toList());

        Dto.QuestionList questionList = Dto.QuestionList.builder()
                .questions(questions)
                .build();
        return ResponseEntity.ok(questionList);
    }

    @GetMapping("/{question_id}")
    public ResponseEntity<Dto.QuestionDetail> getQuestionDetail(@PathVariable int question_id,
                                                                @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        Question question = questionService.findOne(question_id);
        if (question == null || !question.getUser().equals(user)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Dto.QuestionDetail.builder()
                .title(question.getTitle())
                .content(question.getContent())
                .answer(question.getAnswer())
                .createdDate(question.getCreatedDate())
                .answeredDate(question.getAnsweredDate())
                .build());
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createQuestion(@RequestBody Dto.QuestionInfo questionInfo,
                                               @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        questionService.save(Question.builder()
                .title(questionInfo.getTitle())
                .content(questionInfo.getContent())
                .createdDate(LocalDateTime.now())
                .user(user)
                .build());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{question_id}")
    public ResponseEntity<Void> updateQuestion(@PathVariable int question_id, @RequestBody Dto.QuestionInfo questionInfo,
                                               @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        Question question = questionService.findOne(question_id);
        if (question == null || !question.getUser().equals(user)) {
            return ResponseEntity.notFound().build();
        }
        question.setTitle(questionInfo.getTitle());
        question.setContent(questionInfo.getContent());
        questionService.save(question);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{question_id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable int question_id,
                                               @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findByEmail(userPrincipal.getEmail());
        Question questionEntity = questionService.findOne(question_id);
        if (questionEntity == null || !questionEntity.getUser().equals(user)) {
            return ResponseEntity.notFound().build();
        }
        questionService.delete(question_id);
        return ResponseEntity.ok().build();
    }
}
