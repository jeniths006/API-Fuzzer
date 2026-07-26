package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.RequestExecutionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = RequestExecutionController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypasses security filter chain context loading issues completely
class RequestExecutionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RequestExecutionService requestExecutionService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    @WithMockUser
    void executeRequest_ReturnsExecutionResult() throws Exception {
        ExecutionResultDTO dto = new ExecutionResultDTO();
        dto.setStatusCode(200);
        dto.setResponseBody("{\"ok\":true}");
        dto.setSuccessful(true);
        dto.setResponseTime(120L);
        dto.setResponseSize(12L);

        when(requestExecutionService.execute(1L)).thenReturn(dto);

        mockMvc.perform(post("/api/endpoints/1/execute")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.successful").value(true));
    }
}