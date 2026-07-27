package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.FuzzRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.FuzzingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FuzzingController.class)
@AutoConfigureMockMvc(addFilters = false)
class FuzzingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private FuzzingService fuzzingService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    private FuzzRequestDTO fuzzRequestDTO;

    @BeforeEach
    void setUp() {
        fuzzRequestDTO = new FuzzRequestDTO();
        fuzzRequestDTO.setCategories(List.of("SQLi", "XSS"));
    }

    @Test
    @WithMockUser
    void runScan_Success() throws Exception {
        doNothing().when(fuzzingService).runScan(eq(10L), any(FuzzRequestDTO.class));

        mockMvc.perform(post("/api/fuzz/10/run")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fuzzRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Scan Completed."));

        verify(fuzzingService, times(1)).runScan(eq(10L), any(FuzzRequestDTO.class));
    }

    @Test
    @WithMockUser
    void runScan_EndpointNotFound() throws Exception {
        doThrow(new EndpointNotFoundException("Endpoint not found"))
                .when(fuzzingService).runScan(eq(99L), any(FuzzRequestDTO.class));

        mockMvc.perform(post("/api/fuzz/99/run")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fuzzRequestDTO)))
                .andExpect(status().isNotFound());

        verify(fuzzingService, times(1)).runScan(eq(99L), any(FuzzRequestDTO.class));
    }
}