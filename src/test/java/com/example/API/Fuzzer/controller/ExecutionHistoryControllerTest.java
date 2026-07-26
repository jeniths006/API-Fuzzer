package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.ExecutionHistoryResponseDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.ExecutionHistoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ExecutionHistoryController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypasses security filter chain context loading issues completely
class ExecutionHistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExecutionHistoryService executionHistoryService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    @WithMockUser
    void getExecutionHistory_ReturnsList() throws Exception {
        ExecutionHistoryResponseDTO dto = new ExecutionHistoryResponseDTO();
        dto.setId(1L);
        dto.setStatusCode(200);
        dto.setResponseBody("{\"ok\":true}");
        dto.setResponseTime(150L);
        dto.setResponseSize(12L);
        dto.setSuccessful(true);
        dto.setExecutedAt(LocalDateTime.now());

        when(executionHistoryService.getExecutionHistory(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/endpoints/1/executions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].statusCode").value(200))
                .andExpect(jsonPath("$[0].successful").value(true));
    }

    @Test
    @WithMockUser
    void getExecutionHistory_EmptyList_ReturnsOkWithEmptyArray() throws Exception {
        when(executionHistoryService.getExecutionHistory(1L)).thenReturn(List.of());

        mockMvc.perform(get("/api/endpoints/1/executions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @WithMockUser
    void getExecutionHistory_EndpointNotFound_Returns404() throws Exception {
        when(executionHistoryService.getExecutionHistory(99L))
                .thenThrow(new EndpointNotFoundException("Endpoint not found"));

        mockMvc.perform(get("/api/endpoints/99/executions"))
                .andExpect(status().isNotFound());
    }
}