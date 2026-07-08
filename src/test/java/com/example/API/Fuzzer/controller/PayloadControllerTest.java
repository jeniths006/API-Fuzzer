package com.example.API.Fuzzer.controller;


import com.example.API.Fuzzer.dto.UserResponseDTO;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.Fuzzer;
import com.example.API.Fuzzer.service.PayloadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PayloadController.class)
public class PayloadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PayloadService payloadService;

    @MockitoBean
    private AttackPayloadRepository repo;

    @MockitoBean
    private FuzzResultRepository fuzzResultRepository;

    @MockitoBean
    private Fuzzer fuzzer;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void shouldStartFuzzScan() throws Exception {

        String url = "https://www.example.com";
        doNothing().when(fuzzer).fuzzAll(url);

        mockMvc.perform(post("/api/payloads/fuzz-all")
                        .param("targetUrl", url))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(content().string("Fuzzing All initiated for " + url));

        verify(fuzzer).fuzzAll(url);
    }

    @Test
    void shouldHandleCorsPreflight() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options("/api/payloads/fuzz-all")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}
