package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateEndpointRequestDTO;
import com.example.API.Fuzzer.dto.EndpointResponseDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.ProjectNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.HttpMethod;
import com.example.API.Fuzzer.model.Project;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
public class EndpointServiceTest {

    @Mock
    private EndpointRepository endpointRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private EndpointService endpointService;

    @Test
    void createEndpointSuccessfully() {
        CreateEndpointRequestDTO request = new CreateEndpointRequestDTO(
                "Login API",
                HttpMethod.POST,
                "/api/login"
        );

        User user = new User();
        user.setId(1L);
        user.setUsername("jenith");

        Project project = new Project();
        project.setId(1L);
        project.setOwner(user);

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(endpointRepository.save(any(Endpoint.class)))
                .thenAnswer(invocation -> {
                    Endpoint endpoint = invocation.getArgument(0);
                    endpoint.setId(10L);
                    return endpoint;
                });

        EndpointResponseDTO response = endpointService.createEndpoint(1L, request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Login API", response.getName());
        assertEquals(HttpMethod.POST, response.getHttpMethod());
        assertEquals("/api/login", response.getUrl());

        verify(endpointRepository).save(any(Endpoint.class));
    }

    @Test
    void createEndpointProjectNotFound() {
        CreateEndpointRequestDTO request = new CreateEndpointRequestDTO(
                "Login API",
                HttpMethod.POST,
                "/api/login"
        );

        User user = new User();
        user.setId(1L);

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(projectRepository.findById(1L))
                .thenReturn(Optional.empty());

        ProjectNotFoundException exception = assertThrows(
                ProjectNotFoundException.class,
                () -> endpointService.createEndpoint(1L, request)
        );

        assertEquals("Project not found", exception.getMessage());

        verify(endpointRepository, never())
                .save(any(Endpoint.class));
    }

    @Test
    void createEndpointUnauthorized() {

        CreateEndpointRequestDTO request =
                new CreateEndpointRequestDTO(
                        "Login API",
                        HttpMethod.POST,
                        "/api/login"
                );

        User owner = new User();
        owner.setId(1L);

        User attacker = new User();
        attacker.setId(2L);

        Project project = new Project();
        project.setId(1L);
        project.setOwner(owner);

        when(authenticationService.getCurrentUser())
                .thenReturn(attacker);

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        UnauthorizedProjectAccessException exception =
                assertThrows(
                        UnauthorizedProjectAccessException.class,
                        () -> endpointService.createEndpoint(1L, request)
                );

        assertEquals(
                "You are not authorized to access this project",
                exception.getMessage()
        );

        verify(endpointRepository, never())
                .save(any(Endpoint.class));
    }

    @Test
    void getEndpointsSuccessfully() {

        User user = new User();
        user.setId(1L);

        Project project = new Project();
        project.setId(1L);
        project.setOwner(user);

        Endpoint endpoint1 = new Endpoint();
        endpoint1.setId(1L);
        endpoint1.setName("Login");
        endpoint1.setMethod(HttpMethod.POST);
        endpoint1.setUrl("/api/login");
        endpoint1.setProject(project);
        endpoint1.setCreatedAt(LocalDateTime.now());
        endpoint1.setUpdatedAt(LocalDateTime.now());

        Endpoint endpoint2 = new Endpoint();
        endpoint2.setId(2L);
        endpoint2.setName("Users");
        endpoint2.setMethod(HttpMethod.GET);
        endpoint2.setUrl("/api/users");
        endpoint2.setProject(project);
        endpoint2.setCreatedAt(LocalDateTime.now());
        endpoint2.setUpdatedAt(LocalDateTime.now());

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(endpointRepository.findByProject(project))
                .thenReturn(List.of(endpoint1, endpoint2));

        List<EndpointResponseDTO> response =
                endpointService.getEndpoints(1L);

        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals("Login", response.get(0).getName());
        assertEquals("Users", response.get(1).getName());

        verify(endpointRepository).findByProject(project);
    }

    @Test
    void getEndpointsProjectNotFound() {

        User user = new User();
        user.setId(1L);

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(projectRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ProjectNotFoundException.class,
                () -> endpointService.getEndpoints(1L)
        );

        verify(endpointRepository, never())
                .findByProject(any());
    }

    @Test
    void getEndpointsUnauthorized() {

        User owner = new User();
        owner.setId(1L);

        User attacker = new User();
        attacker.setId(2L);

        Project project = new Project();
        project.setOwner(owner);

        when(authenticationService.getCurrentUser())
                .thenReturn(attacker);

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        assertThrows(
                UnauthorizedProjectAccessException.class,
                () -> endpointService.getEndpoints(1L)
        );

        verify(endpointRepository, never())
                .findByProject(any());
    }

    @Test
    void getEndpointSuccessfully() {

        User user = new User();
        user.setId(1L);

        Project project = new Project();
        project.setId(1L);
        project.setOwner(user);

        Endpoint endpoint = new Endpoint();
        endpoint.setId(10L);
        endpoint.setName("Login");
        endpoint.setMethod(HttpMethod.POST);
        endpoint.setUrl("/api/login");
        endpoint.setProject(project);
        endpoint.setCreatedAt(LocalDateTime.now());
        endpoint.setUpdatedAt(LocalDateTime.now());

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.of(endpoint));

        EndpointResponseDTO response =
                endpointService.getEndpoint(10L);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Login", response.getName());
        assertEquals(HttpMethod.POST, response.getHttpMethod());
        assertEquals("/api/login", response.getUrl());

        verify(endpointRepository).findById(10L);
    }

    @Test
    void getEndpointNotFound() {

        User user = new User();
        user.setId(1L);

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.empty());

        EndpointNotFoundException exception =
                assertThrows(
                        EndpointNotFoundException.class,
                        () -> endpointService.getEndpoint(10L)
                );

        assertEquals("Endpoint not found", exception.getMessage());
    }

    @Test
    void getEndpointUnauthorized() {

        User owner = new User();
        owner.setId(1L);

        User attacker = new User();
        attacker.setId(2L);

        Project project = new Project();
        project.setOwner(owner);

        Endpoint endpoint = new Endpoint();
        endpoint.setId(10L);
        endpoint.setProject(project);

        when(authenticationService.getCurrentUser())
                .thenReturn(attacker);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.of(endpoint));

        UnauthorizedProjectAccessException exception =
                assertThrows(
                        UnauthorizedProjectAccessException.class,
                        () -> endpointService.getEndpoint(10L)
                );

        assertEquals(
                "You are not authorized to access this project",
                exception.getMessage()
        );
    }

    @Test
    void updateEndpointSuccessfully() {

        CreateEndpointRequestDTO request =
                new CreateEndpointRequestDTO(
                        "Updated Login",
                        HttpMethod.PUT,
                        "/api/login/update"
                );

        User user = new User();
        user.setId(1L);

        Project project = new Project();
        project.setOwner(user);

        Endpoint endpoint = new Endpoint();
        endpoint.setId(10L);
        endpoint.setName("Login");
        endpoint.setMethod(HttpMethod.POST);
        endpoint.setUrl("/api/login");
        endpoint.setProject(project);
        endpoint.setCreatedAt(LocalDateTime.now());
        endpoint.setUpdatedAt(LocalDateTime.now());

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.of(endpoint));

        when(endpointRepository.save(any(Endpoint.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        EndpointResponseDTO response =
                endpointService.updateEndpoint(10L, request);

        assertNotNull(response);
        assertEquals("Updated Login", response.getName());
        assertEquals(HttpMethod.PUT, response.getHttpMethod());
        assertEquals("/api/login/update", response.getUrl());

        verify(endpointRepository).save(endpoint);
    }

    @Test
    void updateEndpointNotFound() {

        CreateEndpointRequestDTO request =
                new CreateEndpointRequestDTO(
                        "Updated",
                        HttpMethod.PUT,
                        "/api/test"
                );

        User user = new User();
        user.setId(1L);

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.empty());

        assertThrows(
                EndpointNotFoundException.class,
                () -> endpointService.updateEndpoint(10L, request)
        );

        verify(endpointRepository, never()).save(any());
    }

    @Test
    void updateEndpointUnauthorized() {

        CreateEndpointRequestDTO request =
                new CreateEndpointRequestDTO(
                        "Updated",
                        HttpMethod.PUT,
                        "/api/test"
                );

        User owner = new User();
        owner.setId(1L);

        User attacker = new User();
        attacker.setId(2L);

        Project project = new Project();
        project.setOwner(owner);

        Endpoint endpoint = new Endpoint();
        endpoint.setProject(project);

        when(authenticationService.getCurrentUser())
                .thenReturn(attacker);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.of(endpoint));

        assertThrows(
                UnauthorizedProjectAccessException.class,
                () -> endpointService.updateEndpoint(10L, request)
        );

        verify(endpointRepository, never()).save(any());
    }

    @Test
    void deleteEndpointSuccessfully() {

        User user = new User();
        user.setId(1L);

        Project project = new Project();
        project.setOwner(user);

        Endpoint endpoint = new Endpoint();
        endpoint.setId(10L);
        endpoint.setProject(project);

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.of(endpoint));

        endpointService.deleteEndpoint(10L);

        verify(endpointRepository).delete(endpoint);
    }

    @Test
    void deleteEndpointNotFound() {

        User user = new User();
        user.setId(1L);

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.empty());

        assertThrows(
                EndpointNotFoundException.class,
                () -> endpointService.deleteEndpoint(10L)
        );

        verify(endpointRepository, never()).delete(any());
    }

    @Test
    void deleteEndpointUnauthorized() {

        User owner = new User();
        owner.setId(1L);

        User attacker = new User();
        attacker.setId(2L);

        Project project = new Project();
        project.setOwner(owner);

        Endpoint endpoint = new Endpoint();
        endpoint.setProject(project);

        when(authenticationService.getCurrentUser())
                .thenReturn(attacker);

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.of(endpoint));

        assertThrows(
                UnauthorizedProjectAccessException.class,
                () -> endpointService.deleteEndpoint(10L)
        );

        verify(endpointRepository, never()).delete(any());
    }

}
