package com.example.eta.repository;

import com.example.eta.entity.SignupInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SignupInfoRepository extends JpaRepository<SignupInfo, String> {
}
