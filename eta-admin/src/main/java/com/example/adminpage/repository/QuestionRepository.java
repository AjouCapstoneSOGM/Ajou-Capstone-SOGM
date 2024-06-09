package com.example.adminpage.repository;

import com.example.adminpage.entity.Question;
import com.example.adminpage.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findAllByUser(User user);
    List<Question> findAllByAnswerIsNull();
}
