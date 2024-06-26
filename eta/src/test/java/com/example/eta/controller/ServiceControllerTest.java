package com.example.eta.controller;

import static com.example.eta.controller.utils.ControllerTestUtils.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import com.example.eta.repository.SignupInfoRepository;
import com.example.eta.service.UserService;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ServiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SignupInfoRepository signupInfoRepository;

    @Test
    @DisplayName("섹터 목록 API")
    @Transactional
    public void testGetAllSectors() throws Exception {
        // given 회원가입, 로그인 후 jwt토큰 획득
        String authorizationHeader = signUpLogin("suprlux09@ajou.ac.kr", mockMvc, signupInfoRepository);

        // when, then
        MockHttpServletResponse getAllSectorsResponse = mockMvc.perform(get("/api/sector/list")
                .contentType("application/json")
                .header("Authorization", authorizationHeader))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn().getResponse();

        getAllSectorsResponse.setCharacterEncoding("UTF-8");

        Assertions.assertAll(
                () -> assertEquals((Integer) 11, JsonPath.parse(getAllSectorsResponse.getContentAsString()).read("$.length()")),
                () -> assertEquals("에너지", JsonPath.parse(getAllSectorsResponse.getContentAsString()).read("$.G10"))
        );
    }
}
