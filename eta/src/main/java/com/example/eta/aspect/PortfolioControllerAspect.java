package com.example.eta.aspect;

import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.exception.NotFoundException;
import com.example.eta.exception.OwnershipException;
import com.example.eta.repository.PortfolioRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@Aspect
public class PortfolioControllerAspect {

    private PortfolioRepository portfolioRepository;

    public PortfolioControllerAspect(PortfolioRepository portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    @Before("execution(* com.example.eta.controller.PortfolioController.*(..))")
    public void verifyPortfolioAccessible(JoinPoint joinPoint) {
        // TODO: 다른 매커니즘 사용
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] parameterNames = signature.getParameterNames();
        Object[] parameterValues = joinPoint.getArgs();

        String email = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getEmail();
        Integer pfId = null;

        for (int i = 0; i < parameterNames.length; i++) {
            if ("pfId".equals(parameterNames[i])) {
                pfId = (Integer) parameterValues[i];
            }
        }

        if (pfId != null) {
            if (!portfolioRepository.existsById(pfId)) throw new NotFoundException();
            if (!portfolioRepository.getReferenceById(pfId).getUser().getEmail().equals(email))
                throw new OwnershipException();
        }
    }
}
