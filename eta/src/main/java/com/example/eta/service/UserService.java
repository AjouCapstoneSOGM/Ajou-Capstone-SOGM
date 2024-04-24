package com.example.eta.service;

import com.example.eta.dto.UserDto;
import com.example.eta.entity.User;
import com.example.eta.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UserService {
    @Autowired
    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
    }


    public User authenticate(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    @Transactional //변경
    public int join(User user) {
        userRepository.save(user);
        return user.getUserId();
    }

    @Transactional // 데이터 변경
    public void update(int id, UserDto.InfoDto userDto) {
        // User 엔티티 조회
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다. id=" + id));

        //업데이트
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        //userRepository.save(user); 해줄필요없음 더티체킹으로 반영
    }

    public User findOne(int id) {
        // ID로 User 엔티티 조회
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다. id=" + id));
    }

    public List<User> findUsers() {
        return userRepository.findAll();
    }

    public User registerNewUser(UserDto.InfoDto userDto) {
        // User 엔티티 생성
        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());

        // User 저장
        return userRepository.save(user);
    }

    public Boolean isExistEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다. email=" + email));
    }
}