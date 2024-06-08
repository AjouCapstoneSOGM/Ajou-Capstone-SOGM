package com.example.eta.service;

import com.example.eta.entity.Question;
import com.example.eta.entity.User;
import com.example.eta.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public Question findOne(int questionId) {
        return questionRepository.findById(questionId).orElse(null);
    }

    public List<Question> findAllByUser(User user) {
        return questionRepository.findAllByUser(user);
    }

    @Transactional
    public Question save(Question question) {
        return questionRepository.save(question);
    }

    @Transactional
    public void delete(int questionId) {
        questionRepository.deleteById(questionId);
    }
}
