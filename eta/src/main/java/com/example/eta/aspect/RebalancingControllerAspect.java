package com.example.eta.aspect;

import com.example.eta.exception.NotFoundException;
import com.example.eta.exception.OwnershipException;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.RebalancingRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@Aspect
public class RebalancingControllerAspect {
    private PortfolioRepository portfolioRepository;
    private RebalancingRepository rebalancingRepository;

    public RebalancingControllerAspect (PortfolioRepository portfolioRepository, RebalancingRepository rebalancingRepository) {
        this.portfolioRepository = portfolioRepository;
        this.rebalancingRepository = rebalancingRepository;
    }

    @Before("execution(* com.example.eta.controller.RebalancingController.*(..))")
    public void verifyRebalancingAccessible(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] parameterNames = signature.getParameterNames();
        Object[] parameterValues = joinPoint.getArgs();

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer pfId = null;
        Integer rnId = null;

        for (int i = 0; i < parameterNames.length; i++) {
            if ("pfId".equals(parameterNames[i])) {
                pfId = (Integer) parameterValues[i];
            }
            if ("rnId".equals(parameterNames[i])) {
                rnId = (Integer) parameterValues[i];
            }
        }

        if (pfId != null) {
            if (!portfolioRepository.existsById(pfId)) throw new NotFoundException();
            if (!portfolioRepository.getReferenceById(pfId).getUser().getEmail().equals(email)) throw new OwnershipException();
        }
        if (rnId != null) {
            if(!rebalancingRepository.existsById(rnId)) throw new NotFoundException();
            if(!rebalancingRepository.getReferenceById(rnId).getPortfolio().getUser().getEmail().equals(email)) throw new OwnershipException();
        }
    }
}
