package com.example.eta.configuration;

import com.example.eta.intercepter.PortfolioAuthorizationInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfiguration implements WebMvcConfigurer {

    private final PortfolioAuthorizationInterceptor portfolioAuthorizationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(portfolioAuthorizationInterceptor)
                .addPathPatterns("/api/portfolio/**");
    }
}
