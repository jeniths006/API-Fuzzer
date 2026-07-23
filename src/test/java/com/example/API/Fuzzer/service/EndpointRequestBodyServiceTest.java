package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateEndpointRequestBodyRequestDTO;
import com.example.API.Fuzzer.dto.EndpointRequestBodyResponseDTO;
import com.example.API.Fuzzer.exception.EndpointRequestBodyNotFoundException;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.*;
import com.example.API.Fuzzer.repository.EndpointRequestBodyRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.util.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EndpointRequestBodyServiceTest {

    @Mock
    private EndpointRequestBodyRepository endpointRequestBodyRepository;

    @Mock
    private EndpointRepository endpointRepository;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private EndpointRequestBodyService endpointRequestBodyService;

    private User owner;
    private User otherUser;
    private Project project;
    private Endpoint endpoint;
    private EndpointRequestBody endpointRequestBody;
    private CreateEndpointRequestBodyRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);

        otherUser = new User();
        otherUser.setId(2L);

        project = new Project();
        project.setOwner(owner);

        endpoint = new Endpoint();
        endpoint.setId(10L);
        endpoint.setProject(project);

        endpointRequestBody = new EndpointRequestBody();
        endpointRequestBody.setId(100L);
        endpointRequestBody.setContent("{\"key\": \"value\"}");
        endpointRequestBody.setContentType(ContentType.JSON); // Using the Enum value
        endpointRequestBody.setEndpoint(endpoint);

        requestDTO = new CreateEndpointRequestBodyRequestDTO();
        requestDTO.setContent("{\"key\": \"value\"}");
        requestDTO.setContentType(ContentType.JSON); // Using the Enum value
    }

    @Test
    void createRequestBody_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(endpointRequestBodyRepository.findByEndpoint(endpoint)).thenReturn(Optional.empty());
        when(endpointRequestBodyRepository.save(any(EndpointRequestBody.class))).thenReturn(endpointRequestBody);

        EndpointRequestBodyResponseDTO response = endpointRequestBodyService.createRequestBody(10L, requestDTO);

        assertNotNull(response);
        assertEquals(endpointRequestBody.getId(), response.getId());
        assertEquals("{\"key\": \"value\"}", response.getContent());
        assertEquals(ContentType.JSON, response.getContentType());
        assertEquals(endpoint.getId(), response.getEndpointId());
        verify(endpointRequestBodyRepository, times(1)).save(any(EndpointRequestBody.class));
    }

    @Test
    void createRequestBody_EndpointNotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> endpointRequestBodyService.createRequestBody(10L, requestDTO));
        verify(endpointRequestBodyRepository, never()).save(any());
    }

    @Test
    void createRequestBody_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointRequestBodyService.createRequestBody(10L, requestDTO));
        verify(endpointRequestBodyRepository, never()).save(any());
    }

    @Test
    void createRequestBody_AlreadyExists() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(endpointRequestBodyRepository.findByEndpoint(endpoint)).thenReturn(Optional.of(endpointRequestBody));

        assertThrows(IllegalStateException.class, () -> endpointRequestBodyService.createRequestBody(10L, requestDTO));
        verify(endpointRequestBodyRepository, never()).save(any());
    }

    @Test
    void getRequestBody_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(endpointRequestBodyRepository.findByEndpoint(endpoint)).thenReturn(Optional.of(endpointRequestBody));

        EndpointRequestBodyResponseDTO response = endpointRequestBodyService.getRequestBody(10L);

        assertNotNull(response);
        assertEquals(endpointRequestBody.getId(), response.getId());
        assertEquals("{\"key\": \"value\"}", response.getContent());
        assertEquals(endpoint.getId(), response.getEndpointId());
    }

    @Test
    void getRequestBody_EndpointNotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> endpointRequestBodyService.getRequestBody(10L));
        verify(endpointRequestBodyRepository, never()).findByEndpoint(any());
    }

    @Test
    void getRequestBody_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointRequestBodyService.getRequestBody(10L));
        verify(endpointRequestBodyRepository, never()).findByEndpoint(any());
    }

    @Test
    void getRequestBody_NotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(endpointRequestBodyRepository.findByEndpoint(endpoint)).thenReturn(Optional.empty());

        assertThrows(EndpointRequestBodyNotFoundException.class, () -> endpointRequestBodyService.getRequestBody(10L));
    }

    @Test
    void updateRequestBody_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRequestBodyRepository.findById(100L)).thenReturn(Optional.of(endpointRequestBody));
        when(endpointRequestBodyRepository.save(any(EndpointRequestBody.class))).thenReturn(endpointRequestBody);

        EndpointRequestBodyResponseDTO response = endpointRequestBodyService.updateRequestBody(100L, requestDTO);

        assertNotNull(response);
        assertEquals(endpointRequestBody.getId(), response.getId());
        assertEquals("{\"key\": \"value\"}", response.getContent());
        verify(endpointRequestBodyRepository, times(1)).save(any(EndpointRequestBody.class));
    }

    @Test
    void updateRequestBody_NotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRequestBodyRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(EndpointRequestBodyNotFoundException.class, () -> endpointRequestBodyService.updateRequestBody(100L, requestDTO));
        verify(endpointRequestBodyRepository, never()).save(any());
    }

    @Test
    void updateRequestBody_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRequestBodyRepository.findById(100L)).thenReturn(Optional.of(endpointRequestBody));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointRequestBodyService.updateRequestBody(100L, requestDTO));
        verify(endpointRequestBodyRepository, never()).save(any());
    }

    @Test
    void deleteRequestBody_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRequestBodyRepository.findById(100L)).thenReturn(Optional.of(endpointRequestBody));

        assertDoesNotThrow(() -> endpointRequestBodyService.deleteRequestBody(100L));
        verify(endpointRequestBodyRepository, times(1)).delete(endpointRequestBody);
    }

    @Test
    void deleteRequestBody_NotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRequestBodyRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(EndpointRequestBodyNotFoundException.class, () -> endpointRequestBodyService.deleteRequestBody(100L));
        verify(endpointRequestBodyRepository, never()).delete(any());
    }

    @Test
    void deleteRequestBody_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRequestBodyRepository.findById(100L)).thenReturn(Optional.of(endpointRequestBody));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointRequestBodyService.deleteRequestBody(100L));
        verify(endpointRequestBodyRepository, never()).delete(any());
    }
}