package com.example.adminpage.controller;

import com.example.adminpage.entity.Question;
import com.example.adminpage.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/questions")
public class QuestionController {

    @Getter
    @Setter
    public class AnswerDto {
        private String answer;
        private int questionId;
    }

    private final QuestionRepository questionRepository;

    @GetMapping
    public String getQuestions(Model model) {
        List<Question> questions = questionRepository.findAll();
        Collections.reverse(questions);

        model.addAttribute("questions", questions);
        model.addAttribute("getOnlyUnanswered", false);
        return "Questions";
    }

    @GetMapping("/unanswered")
    public String getUnansweredQuestions(Model model) {
        List<Question> questions = questionRepository.findAllByAnswerIsNull();
        Collections.reverse(questions);

        model.addAttribute("questions", questions);
        model.addAttribute("getOnlyUnanswered", true);
        return "Questions";
    }

    @GetMapping("/{questionId}")
    public String getQuestionDetail(Model model, @PathVariable Integer questionId, AnswerDto answerDto) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return "redirect:/questions";
        }
        model.addAttribute("question", question);
        model.addAttribute("answerDto", answerDto);
        return "QuestionDetail";
    }

    @PostMapping
    @Transactional
    public String postAnswer(@ModelAttribute AnswerDto answerDto) {
        Question question = questionRepository.findById(answerDto.getQuestionId()).orElse(null);
        if (question == null) {
            return "redirect:/questions";
        }
        System.out.println(answerDto.getAnswer());
        question.setAnswer(answerDto.getAnswer());
        question.setAnsweredDate(LocalDateTime.now());
        return "redirect:/questions";
    }
}
