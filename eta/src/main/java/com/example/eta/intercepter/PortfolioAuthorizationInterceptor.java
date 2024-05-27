package com.example.eta.intercepter;

import com.example.eta.auth.entity.UserPrincipal;
import com.example.eta.exception.NotFoundException;
import com.example.eta.exception.OwnershipException;
import com.example.eta.repository.PortfolioRepository;
import com.example.eta.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PortfolioAuthorizationInterceptor implements HandlerInterceptor {

    private final PortfolioRepository portfolioRepository;

    @Override
    @Transactional
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws RuntimeException {
        String email = ((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getEmail();

        Map<String, String> pathVariables = (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);

        if (pathVariables.get("port_id") == null)
            return true;
        Integer pfId = Integer.parseInt(pathVariables.get("port_id"));

        if (!portfolioRepository.existsById(pfId)) throw new NotFoundException();
        if (!portfolioRepository.findById(pfId).get().getUser().getEmail().equals(email))
            throw new OwnershipException();

        return true;
    }
}
