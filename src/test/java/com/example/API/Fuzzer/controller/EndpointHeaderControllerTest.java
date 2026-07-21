package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateEndpointHeaderRequestDTO;
import com.example.API.Fuzzer.dto.EndpointHeaderResponseDTO;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtAuthenticationFilter;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.EndpointHeaderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = EndpointHeaderController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class EndpointHeaderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private EndpointHeaderService endpointHeaderService;

    private EndpointHeaderResponseDTO responseDTO;
    private CreateEndpointHeaderRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        responseDTO = new EndpointHeaderResponseDTO(
                100L,
                "Authorization",
                "Bearer token",
                10L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        requestDTO = new CreateEndpointHeaderRequestDTO();
        requestDTO.setHeaderName("Authorization");
        requestDTO.setHeaderValue("Bearer token");
    }

    @Test
    void createHeader_Success() throws Exception {
        when(endpointHeaderService.createHeader(eq(10L), any(CreateEndpointHeaderRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(post("/api/endpoints/10/headers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.headerName").value("Authorization"))
                .andExpect(jsonPath("$.headerValue").value("Bearer token"))
                .andExpect(jsonPath("$.endpointId").value(10L));

        verify(endpointHeaderService, times(1)).createHeader(eq(10L), any(CreateEndpointHeaderRequestDTO.class));
    }

    @Test
    void getHeaders_Success() throws Exception {
        when(endpointHeaderService.getHeaders(10L)).thenReturn(List.of(responseDTO));

        mockMvc.perform(get("/api/endpoints/10/headers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(100L))
                .andExpect(jsonPath("$[0].headerName").value("Authorization"))
                .andExpect(jsonPath("$[0].endpointId").value(10L));

        verify(endpointHeaderService, times(1)).getHeaders(10L);
    }

    @Test
    void updateHeader_Success() throws Exception {
        when(endpointHeaderService.updateHeader(eq(100L), any(CreateEndpointHeaderRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(put("/api/headers/100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.headerName").value("Authorization"));

        verify(endpointHeaderService, times(1)).updateHeader(eq(100L), any(CreateEndpointHeaderRequestDTO.class));
    }

    @Test
    void deleteHeader_Success() throws Exception {
        doNothing().when(endpointHeaderService).deleteHeader(100L);

        mockMvc.perform(delete("/api/headers/100"))
                .andExpect(status().isNoContent());

        verify(endpointHeaderService, times(1)).deleteHeader(100L);
    }
}