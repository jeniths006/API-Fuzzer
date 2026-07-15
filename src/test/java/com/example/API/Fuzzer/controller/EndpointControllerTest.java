package com.example.API.Fuzzer.controller;


import com.example.API.Fuzzer.dto.CreateEndpointRequestDTO;
import com.example.API.Fuzzer.dto.EndpointResponseDTO;
import com.example.API.Fuzzer.model.HttpMethod;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.ProjectRepository;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtAuthenticationFilter;
import com.example.API.Fuzzer.security.JwtUtil;
import com.example.API.Fuzzer.service.AuthenticationService;
import com.example.API.Fuzzer.service.EndpointService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;


import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;


@WebMvcTest(controllers = EndpointController.class,
excludeAutoConfiguration = {SecurityAutoConfiguration.class})
@AutoConfigureMockMvc(addFilters = false)
public class EndpointControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private EndpointService endpointService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private AuthenticationService authenticationService;

    @MockitoBean
    private ProjectRepository projectRepository;

    @BeforeEach
    void setUp() {
        User mockUser = new User();
        mockUser.setId(1L);
        when(authenticationService.getCurrentUser()).thenReturn(mockUser);
    }

    @Test
    void createEndpointSuccessfully() throws Exception {

        CreateEndpointRequestDTO request =
                new CreateEndpointRequestDTO(
                        "Login API",
                        HttpMethod.POST,
                        "/api/login"
                );

        EndpointResponseDTO response =
                new EndpointResponseDTO(
                        1L,
                        "Login API",
                        HttpMethod.POST,
                        "/api/login",
                        10L,
                        LocalDateTime.now(),
                        LocalDateTime.now()
                );

        when(endpointService.createEndpoint(eq(10L), any(CreateEndpointRequestDTO.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/projects/10/endpoints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Login API"))
                .andExpect(jsonPath("$.httpMethod").value("POST"))
                .andExpect(jsonPath("$.url").value("/api/login"));

        verify(endpointService).createEndpoint(eq(10L), any(CreateEndpointRequestDTO.class));
    }

    @Test
    void getEndpointsSuccessfully() throws Exception {

        EndpointResponseDTO endpoint1 = new EndpointResponseDTO(
                1L,
                "Login API",
                HttpMethod.POST,
                "/api/login",
                10L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        EndpointResponseDTO endpoint2 = new EndpointResponseDTO(
                2L,
                "Users API",
                HttpMethod.GET,
                "/api/users",
                10L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(endpointService.getEndpoints(10L))
                .thenReturn(List.of(endpoint1, endpoint2));

        mockMvc.perform(get("/api/projects/10/endpoints"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Login API"))
                .andExpect(jsonPath("$[1].name").value("Users API"));

        verify(endpointService).getEndpoints(10L);
    }

    @Test
    void getEndpointSuccessfully() throws Exception {

        EndpointResponseDTO response = new EndpointResponseDTO(
                1L,
                "Login API",
                HttpMethod.POST,
                "/api/login",
                10L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(endpointService.getEndpoint(1L))
                .thenReturn(response);

        mockMvc.perform(get("/api/endpoints/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Login API"))
                .andExpect(jsonPath("$.httpMethod").value("POST"))
                .andExpect(jsonPath("$.url").value("/api/login"));

        verify(endpointService).getEndpoint(1L);
    }

    @Test
    void updateEndpointSuccessfully() throws Exception {

        CreateEndpointRequestDTO request = new CreateEndpointRequestDTO(
                "Updated Login",
                HttpMethod.PUT,
                "/api/login/update"
        );

        EndpointResponseDTO response = new EndpointResponseDTO(
                1L,
                "Updated Login",
                HttpMethod.PUT,
                "/api/login/update",
                10L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(endpointService.updateEndpoint(eq(1L), any(CreateEndpointRequestDTO.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/endpoints/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Updated Login"))
                .andExpect(jsonPath("$.httpMethod").value("PUT"))
                .andExpect(jsonPath("$.url").value("/api/login/update"));

        verify(endpointService).updateEndpoint(eq(1L), any(CreateEndpointRequestDTO.class));
    }

    @Test
    void deleteEndpointSuccessfully() throws Exception {

        doNothing().when(endpointService).deleteEndpoint(1L);

        mockMvc.perform(delete("/api/endpoints/1"))
                .andExpect(status().isNoContent());

        verify(endpointService).deleteEndpoint(1L);
    }

}
