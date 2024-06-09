package com.example.adminpage.controller;


import com.example.adminpage.entity.Portfolio;
import com.example.adminpage.entity.User;
import com.example.adminpage.repository.PortfolioRecordRepository;
import com.example.adminpage.repository.PortfolioRepository;
import com.example.adminpage.repository.PortfolioTickerRepository;
import com.example.adminpage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/portfolio")
public class PortfolioController {
    @Value("${application.url}")
    private String baseUrl;

    @Autowired
    private PortfolioRepository portfolioRepository;
    @Autowired
    private PortfolioRecordRepository portfolioRecordRepository;

    @GetMapping
    public String getPortfolios(Model model) {
        model.addAttribute("portfolios", portfolioRepository.findAll());
        return "Portfolio";
    }
    @GetMapping("/search/{searchType}/{query}")
    public String search(@PathVariable("searchType") String searchType, @PathVariable("query") String query, Model model) {
        switch (searchType) {
            case "id":
                portfolioRepository.findById(Integer.valueOf(query)).ifPresent(portfolio -> model.addAttribute("portfolios", List.of(portfolio)));
                break;
            case "userId":
                model.addAttribute("portfolios", portfolioRepository.findAllByUserId(Integer.parseInt(query)));
                break;
            default:
        }
        return "portfolio";
    }
    @GetMapping("/{PfId}")
    public String getPortfolioDetail(@PathVariable("PfId") int PfId, Model model,RedirectAttributes redirectAttributes) {
        Portfolio portfolio = portfolioRepository.getReferenceById(PfId);

        if (!Boolean.TRUE.equals(portfolio.getIsAuto())) {
            redirectAttributes.addFlashAttribute("errorMessage", "This portfolio is not accessible.");
            return "redirect:/portfolio";
        }

        model.addAttribute("portfolio", portfolioRepository.getReferenceById(PfId));
        model.addAttribute("records", portfolioRecordRepository.findAllByPfId(PfId));
        return "PortfolioDetail";
    }
    @DeleteMapping("/{port_id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable("port_id") Integer pfId) {
        portfolioRepository.deleteById(pfId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/execute")
    public String executeRebalancing(@RequestParam("pfId") int pfId, RedirectAttributes redirectAttributes) {
        User user = portfolioRepository.findById(pfId).get().getUser();

        // Spring Boot 서버의 API를 호출
        HttpStatusCode statusCode = WebClient.builder().baseUrl(baseUrl).build()
            .put()
            .uri("/api/rebalancing/"+pfId+"/execute")
            .retrieve()
            .toEntity(Void.class)
            .block().getStatusCode();

        if (statusCode == HttpStatus.OK) {
            redirectAttributes.addFlashAttribute("message", "포트폴리오 " + pfId + " 비중 갱신 완료, 리밸런싱 알림이 생성되었습니다.");
        }
        else if (statusCode == HttpStatus.NO_CONTENT) {
            redirectAttributes.addFlashAttribute("message", "포트폴리오 " + pfId + " 비중 갱신 완료, 리밸런싱 대상이 아닙니다.");
        }
        else {
            redirectAttributes.addFlashAttribute("message", "포트폴리오 " + pfId + " 비중 갱신 실패");
        }

        return "redirect:/users/" + user.getUserId();
    }
}