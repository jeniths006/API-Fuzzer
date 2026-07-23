package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateEndpointHeaderRequestDTO;
import com.example.API.Fuzzer.dto.EndpointHeaderResponseDTO;
import com.example.API.Fuzzer.exception.EndpointHeaderNotFoundException;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.*;
import com.example.API.Fuzzer.repository.EndpointHeaderRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EndpointHeaderServiceTest {

    @Mock
    private EndpointHeaderRepository endpointHeaderRepository;

    @Mock
    private EndpointRepository endpointRepository;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private EndpointHeaderService endpointHeaderService;

    private User owner;
    private User otherUser;
    private Project project;
    private Endpoint endpoint;
    private EndpointHeader endpointHeader;
    private CreateEndpointHeaderRequestDTO requestDTO;

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

        endpointHeader = new EndpointHeader();
        endpointHeader.setId(100L);
        endpointHeader.setHeaderName("Authorization");
        endpointHeader.setHeaderValue("Bearer token");
        endpointHeader.setEndpoint(endpoint);

        requestDTO = new CreateEndpointHeaderRequestDTO();
        requestDTO.setHeaderName("Authorization");
        requestDTO.setHeaderValue("Bearer token");
    }

    @Test
    void createHeader_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(endpointHeaderRepository.save(any(EndpointHeader.class))).thenReturn(endpointHeader);

        EndpointHeaderResponseDTO response = endpointHeaderService.createHeader(10L, requestDTO);

        assertNotNull(response);
        assertEquals(endpointHeader.getId(), response.getId());
        assertEquals("Authorization", response.getHeaderName());
        assertEquals("Bearer token", response.getHeaderValue());
        assertEquals(endpoint.getId(), response.getEndpointId());
        verify(endpointHeaderRepository, times(1)).save(any(EndpointHeader.class));
    }

    @Test
    void createHeader_EndpointNotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> endpointHeaderService.createHeader(10L, requestDTO));
        verify(endpointHeaderRepository, never()).save(any());
    }

    @Test
    void createHeader_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointHeaderService.createHeader(10L, requestDTO));
        verify(endpointHeaderRepository, never()).save(any());
    }

    @Test
    void getHeaders_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(endpointHeaderRepository.findByEndpoint(endpoint)).thenReturn(List.of(endpointHeader));

        List<EndpointHeaderResponseDTO> responses = endpointHeaderService.getHeaders(10L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(endpointHeader.getId(), responses.get(0).getId());
        assertEquals("Authorization", responses.get(0).getHeaderName());
        assertEquals("Bearer token", responses.get(0).getHeaderValue());
        assertEquals(endpoint.getId(), responses.get(0).getEndpointId());
    }

    @Test
    void getHeaders_EndpointNotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> endpointHeaderService.getHeaders(10L));
        verify(endpointHeaderRepository, never()).findByEndpoint(any());
    }

    @Test
    void getHeaders_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointHeaderService.getHeaders(10L));
        verify(endpointHeaderRepository, never()).findByEndpoint(any());
    }

    @Test
    void updateHeader_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointHeaderRepository.findById(100L)).thenReturn(Optional.of(endpointHeader));
        when(endpointHeaderRepository.save(any(EndpointHeader.class))).thenReturn(endpointHeader);

        EndpointHeaderResponseDTO response = endpointHeaderService.updateHeader(100L, requestDTO);

        assertNotNull(response);
        assertEquals(endpointHeader.getId(), response.getId());
        assertEquals("Authorization", response.getHeaderName());
        assertEquals(endpoint.getId(), response.getEndpointId());
        verify(endpointHeaderRepository, times(1)).save(any(EndpointHeader.class));
    }

    @Test
    void updateHeader_NotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointHeaderRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(EndpointHeaderNotFoundException.class, () -> endpointHeaderService.updateHeader(100L, requestDTO));
        verify(endpointHeaderRepository, never()).save(any());
    }

    @Test
    void updateHeader_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointHeaderRepository.findById(100L)).thenReturn(Optional.of(endpointHeader));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointHeaderService.updateHeader(100L, requestDTO));
        verify(endpointHeaderRepository, never()).save(any());
    }

    @Test
    void deleteHeader_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointHeaderRepository.findById(100L)).thenReturn(Optional.of(endpointHeader));

        assertDoesNotThrow(() -> endpointHeaderService.deleteHeader(100L));
        verify(endpointHeaderRepository, times(1)).delete(endpointHeader);
    }

    @Test
    void deleteHeader_NotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointHeaderRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(EndpointHeaderNotFoundException.class, () -> endpointHeaderService.deleteHeader(100L));
        verify(endpointHeaderRepository, never()).delete(any());
    }

    @Test
    void deleteHeader_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointHeaderRepository.findById(100L)).thenReturn(Optional.of(endpointHeader));

        assertThrows(UnauthorizedProjectAccessException.class, () -> endpointHeaderService.deleteHeader(100L));
        verify(endpointHeaderRepository, never()).delete(any());
    }
}