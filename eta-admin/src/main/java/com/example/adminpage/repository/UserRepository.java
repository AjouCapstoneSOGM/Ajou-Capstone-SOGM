package com.example.adminpage.repository;

import com.example.adminpage.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT t FROM User t WHERE t.email LIKE %:email%")
    List<User> findAllByEmailContaining(@Param("email") String email);
    @Query("SELECT t FROM User t WHERE t.name LIKE %:name%")
    List<User> findAllByNameContaining(@Param("name") String name);
    @Query("SELECT p FROM User p WHERE p.userId = :userId")
    Optional<User> findAllByUserId(@Param("userId") int userId);
    @Query("SELECT p FROM User p WHERE p.email = :email")
    Optional<Object> findByEmail(String email);
    @Query("SELECT COUNT(u) FROM User u WHERE u.socialType IS NOT NULL")
    long countSocialUsers();
    @Query("SELECT COUNT(u) FROM User u WHERE u.socialType IS NULL")
    long countRegularUsers();
    long count();
}