package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateQueryParameterRequestDTO;
import com.example.API.Fuzzer.dto.QueryParameterResponseDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.QueryParameterNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.*;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.QueryParameterRepository;
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
class QueryParameterServiceTest {

    @Mock
    private QueryParameterRepository queryParameterRepository;

    @Mock
    private EndpointRepository endpointRepository;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private QueryParameterService queryParameterService;

    private User owner;
    private User otherUser;
    private Project project;
    private Endpoint endpoint;
    private QueryParameter queryParameter;
    private CreateQueryParameterRequestDTO requestDTO;

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

        queryParameter = new QueryParameter();
        queryParameter.setId(100L);
        queryParameter.setParameterName("search");
        queryParameter.setParameterValue("spring");
        queryParameter.setEndpoint(endpoint);

        requestDTO = new CreateQueryParameterRequestDTO();
        requestDTO.setParameterName("search");
        requestDTO.setParameterValue("spring");
    }

    @Test
    void createQueryParameter_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(queryParameterRepository.save(any(QueryParameter.class))).thenReturn(queryParameter);

        QueryParameterResponseDTO response = queryParameterService.createQueryParameter(10L, requestDTO);

        assertNotNull(response);
        assertEquals(queryParameter.getId(), response.getId());
        assertEquals("search", response.getParameterName());
        assertEquals("spring", response.getParameterValue());
        assertEquals(endpoint.getId(), response.getEndpointId());
        verify(queryParameterRepository, times(1)).save(any(QueryParameter.class));
    }

    @Test
    void createQueryParameter_EndpointNotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> queryParameterService.createQueryParameter(10L, requestDTO));
        verify(queryParameterRepository, never()).save(any());
    }

    @Test
    void createQueryParameter_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));

        assertThrows(UnauthorizedProjectAccessException.class, () -> queryParameterService.createQueryParameter(10L, requestDTO));
        verify(queryParameterRepository, never()).save(any());
    }

    @Test
    void getQueryParameters_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(queryParameterRepository.findByEndpoint(endpoint)).thenReturn(List.of(queryParameter));

        List<QueryParameterResponseDTO> responses = queryParameterService.getQueryParameters(10L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(queryParameter.getId(), responses.get(0).getId());
        assertEquals("search", responses.get(0).getParameterName());
        assertEquals("spring", responses.get(0).getParameterValue());
        assertEquals(endpoint.getId(), responses.get(0).getEndpointId());
    }

    @Test
    void getQueryParameters_EndpointNotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> queryParameterService.getQueryParameters(10L));
        verify(queryParameterRepository, never()).findByEndpoint(any());
    }

    @Test
    void getQueryParameters_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));

        assertThrows(UnauthorizedProjectAccessException.class, () -> queryParameterService.getQueryParameters(10L));
        verify(queryParameterRepository, never()).findByEndpoint(any());
    }

    @Test
    void updateQueryParameter_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(queryParameterRepository.findById(100L)).thenReturn(Optional.of(queryParameter));
        when(queryParameterRepository.save(any(QueryParameter.class))).thenReturn(queryParameter);

        QueryParameterResponseDTO response = queryParameterService.updateQueryParameter(100L, requestDTO);

        assertNotNull(response);
        assertEquals(queryParameter.getId(), response.getId());
        assertEquals("search", response.getParameterName());
        assertEquals(endpoint.getId(), response.getEndpointId());
        verify(queryParameterRepository, times(1)).save(any(QueryParameter.class));
    }

    @Test
    void updateQueryParameter_NotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(queryParameterRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(QueryParameterNotFoundException.class, () -> queryParameterService.updateQueryParameter(100L, requestDTO));
        verify(queryParameterRepository, never()).save(any());
    }

    @Test
    void updateQueryParameter_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(queryParameterRepository.findById(100L)).thenReturn(Optional.of(queryParameter));

        assertThrows(UnauthorizedProjectAccessException.class, () -> queryParameterService.updateQueryParameter(100L, requestDTO));
        verify(queryParameterRepository, never()).save(any());
    }

    @Test
    void deleteQueryParameter_Success() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(queryParameterRepository.findById(100L)).thenReturn(Optional.of(queryParameter));

        assertDoesNotThrow(() -> queryParameterService.deleteQueryParameter(100L));
        verify(queryParameterRepository, times(1)).delete(queryParameter);
    }

    @Test
    void deleteQueryParameter_NotFound() {
        when(authenticationService.getCurrentUser()).thenReturn(owner);
        when(queryParameterRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(QueryParameterNotFoundException.class, () -> queryParameterService.deleteQueryParameter(100L));
        verify(queryParameterRepository, never()).delete(any());
    }

    @Test
    void deleteQueryParameter_UnauthorizedAccess() {
        when(authenticationService.getCurrentUser()).thenReturn(otherUser);
        when(queryParameterRepository.findById(100L)).thenReturn(Optional.of(queryParameter));

        assertThrows(UnauthorizedProjectAccessException.class, () -> queryParameterService.deleteQueryParameter(100L));
        verify(queryParameterRepository, never()).delete(any());
    }
}