package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateEndpointRequestBodyRequestDTO;
import com.example.API.Fuzzer.dto.EndpointRequestBodyResponseDTO;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtAuthenticationFilter;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.EndpointRequestBodyService;
import com.example.API.Fuzzer.util.ContentType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RequestBodyController.class)
@AutoConfigureMockMvc(addFilters = false)
class EndpointRequestBodyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private EndpointRequestBodyService endpointRequestBodyService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private EndpointRequestBodyResponseDTO responseDTO;
    private CreateEndpointRequestBodyRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        responseDTO = new EndpointRequestBodyResponseDTO(
                100L,
                "{\"key\": \"value\"}",
                ContentType.JSON,
                10L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        requestDTO = new CreateEndpointRequestBodyRequestDTO();
        requestDTO.setContent("{\"key\": \"value\"}");
        requestDTO.setContentType(ContentType.JSON);
    }

    @Test
    void createRequestBody_Success() throws Exception {
        when(endpointRequestBodyService.createRequestBody(eq(10L), any(CreateEndpointRequestBodyRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(post("/api/endpoints/10/request-body")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.content").value("{\"key\": \"value\"}"))
                .andExpect(jsonPath("$.contentType").value("JSON"))
                .andExpect(jsonPath("$.endpointId").value(10L));

        verify(endpointRequestBodyService, times(1)).createRequestBody(eq(10L), any(CreateEndpointRequestBodyRequestDTO.class));
    }

    @Test
    void getRequestBody_Success() throws Exception {
        when(endpointRequestBodyService.getRequestBody(10L)).thenReturn(responseDTO);

        mockMvc.perform(get("/api/endpoints/10/request-body"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.content").value("{\"key\": \"value\"}"))
                .andExpect(jsonPath("$.endpointId").value(10L));

        verify(endpointRequestBodyService, times(1)).getRequestBody(10L);
    }

    @Test
    void updateRequestBody_Success() throws Exception {
        when(endpointRequestBodyService.updateRequestBody(eq(100L), any(CreateEndpointRequestBodyRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(put("/api/request-body/100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.content").value("{\"key\": \"value\"}"));

        verify(endpointRequestBodyService, times(1)).updateRequestBody(eq(100L), any(CreateEndpointRequestBodyRequestDTO.class));
    }

    @Test
    void deleteRequestBody_Success() throws Exception {
        doNothing().when(endpointRequestBodyService).deleteRequestBody(100L);

        mockMvc.perform(delete("/api/request-body/100"))
                .andExpect(status().isNoContent());

        verify(endpointRequestBodyService, times(1)).deleteRequestBody(100L);
    }
}