package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateQueryParameterRequestDTO;
import com.example.API.Fuzzer.dto.QueryParameterResponseDTO;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtAuthenticationFilter;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.EndpointHeaderService;
import com.example.API.Fuzzer.service.QueryParameterService;
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
        controllers = QueryParameterController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class QueryParameterControllerTest {

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

    @MockitoBean
    private QueryParameterService queryParameterService;

    private QueryParameterResponseDTO responseDTO;
    private CreateQueryParameterRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        responseDTO = new QueryParameterResponseDTO(
                100L,
                "search",
                "spring",
                10L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        requestDTO = new CreateQueryParameterRequestDTO();
        requestDTO.setParameterName("search");
        requestDTO.setParameterValue("spring");
    }

    @Test
    void createQueryParameter_Success() throws Exception {
        when(queryParameterService.createQueryParameter(eq(10L), any(CreateQueryParameterRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(post("/api/endpoints/10/query-parameters")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.parameterName").value("search"))
                .andExpect(jsonPath("$.parameterValue").value("spring"))
                .andExpect(jsonPath("$.endpointId").value(10L));

        verify(queryParameterService, times(1)).createQueryParameter(eq(10L), any(CreateQueryParameterRequestDTO.class));
    }

    @Test
    void getQueryParameters_Success() throws Exception {
        when(queryParameterService.getQueryParameters(10L)).thenReturn(List.of(responseDTO));

        mockMvc.perform(get("/api/endpoints/10/query-parameters"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(100L))
                .andExpect(jsonPath("$[0].parameterName").value("search"))
                .andExpect(jsonPath("$[0].endpointId").value(10L));

        verify(queryParameterService, times(1)).getQueryParameters(10L);
    }

    @Test
    void updateQueryParameter_Success() throws Exception {
        when(queryParameterService.updateQueryParameter(eq(100L), any(CreateQueryParameterRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(put("/api/query-parameters/100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.parameterName").value("search"));

        verify(queryParameterService, times(1)).updateQueryParameter(eq(100L), any(CreateQueryParameterRequestDTO.class));
    }

    @Test
    void deleteQueryParameter_Success() throws Exception {
        doNothing().when(queryParameterService).deleteQueryParameter(100L);

        mockMvc.perform(delete("/api/query-parameters/100"))
                .andExpect(status().isNoContent());

        verify(queryParameterService, times(1)).deleteQueryParameter(100L);
    }
}