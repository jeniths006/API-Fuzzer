package com.example.API.Fuzzer.controller;


import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
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
}
