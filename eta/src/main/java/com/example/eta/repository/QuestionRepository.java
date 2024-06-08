package com.example.eta.repository;

import com.example.eta.entity.Question;
import com.example.eta.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findAllByUser(User user);
}
