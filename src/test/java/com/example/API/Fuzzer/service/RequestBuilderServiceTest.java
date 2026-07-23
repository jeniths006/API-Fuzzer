package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.EndpointRequestBodyNotFoundException;
import com.example.API.Fuzzer.model.*;
import com.example.API.Fuzzer.repository.EndpointHeaderRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.EndpointRequestBodyRepository;
import com.example.API.Fuzzer.repository.QueryParameterRepository;
import com.example.API.Fuzzer.util.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequestBuilderServiceTest {

    @Mock
    private EndpointRepository endpointRepository;

    @Mock
    private EndpointHeaderRepository endpointHeaderRepository;

    @Mock
    private QueryParameterRepository queryParameterRepository;

    @Mock
    private EndpointRequestBodyRepository endpointRequestBodyRepository;

    @InjectMocks
    private RequestBuilderService requestBuilderService;

    private Endpoint endpoint;
    private EndpointHeader header;
    private QueryParameter queryParameter;
    private EndpointRequestBody requestBody;

    @BeforeEach
    void setUp() {
        endpoint = new Endpoint();
        endpoint.setId(10L);
        endpoint.setUrl("https://api.example.com/test");
        endpoint.setMethod(HttpMethod.POST);

        header = new EndpointHeader();
        header.setHeaderName("Authorization");
        header.setHeaderValue("Bearer token");

        queryParameter = new QueryParameter();
        queryParameter.setParameterName("search");
        queryParameter.setParameterValue("spring");

        requestBody = new EndpointRequestBody();
        requestBody.setContent("{\"message\": \"hello\"}");
        requestBody.setContentType(ContentType.JSON);
    }

    @Test
    void buildRequest_Success() {
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(endpointHeaderRepository.findByEndpoint(endpoint)).thenReturn(List.of(header));
        when(queryParameterRepository.findByEndpoint(endpoint)).thenReturn(List.of(queryParameter));
        when(endpointRequestBodyRepository.findByEndpoint(endpoint)).thenReturn(Optional.of(requestBody));

        BuiltRequestDTO result = requestBuilderService.buildRequest(10L);

        assertNotNull(result);
        assertEquals("https://api.example.com/test", result.getUrl());
        assertEquals(HttpMethod.POST, result.getMethod());

        assertEquals(1, result.getHeaders().size());
        assertEquals("Bearer token", result.getHeaders().get("Authorization"));

        assertEquals(1, result.getQueryParameters().size());
        assertEquals("spring", result.getQueryParameters().get("search"));

        assertEquals("{\"message\": \"hello\"}", result.getBody());
        assertEquals(ContentType.JSON, result.getContentType());

        verify(endpointRepository, times(1)).findById(10L);
        verify(endpointHeaderRepository, times(1)).findByEndpoint(endpoint);
        verify(queryParameterRepository, times(1)).findByEndpoint(endpoint);
        verify(endpointRequestBodyRepository, times(1)).findByEndpoint(endpoint);
    }

    @Test
    void buildRequest_EndpointNotFound() {
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> requestBuilderService.buildRequest(10L));
        verify(endpointHeaderRepository, never()).findByEndpoint(any());
        verify(queryParameterRepository, never()).findByEndpoint(any());
        verify(endpointRequestBodyRepository, never()).findByEndpoint(any());
    }

    @Test
    void buildRequest_NoRequestBody() {

        when(endpointRepository.findById(10L))
                .thenReturn(Optional.of(endpoint));

        when(endpointHeaderRepository.findByEndpoint(endpoint))
                .thenReturn(List.of(header));

        when(queryParameterRepository.findByEndpoint(endpoint))
                .thenReturn(List.of(queryParameter));

        when(endpointRequestBodyRepository.findByEndpoint(endpoint))
                .thenReturn(Optional.empty());

        BuiltRequestDTO result =
                requestBuilderService.buildRequest(10L);

        assertNull(result.getBody());
        assertNull(result.getContentType());
    }

    @Test
    void buildRequest_NoHeaders() {
        when(endpointHeaderRepository.findByEndpoint(endpoint))
                .thenReturn(List.of());

        BuiltRequestDTO result =
                requestBuilderService.buildRequest(10L);

        assertTrue(result.getHeaders().isEmpty());
    }


    @Test
    void buildRequest_NoQueryParameters() {
        when(queryParameterRepository.findByEndpoint(endpoint))
                .thenReturn(List.of());

        BuiltRequestDTO result =
                requestBuilderService.buildRequest(10L);

        assertTrue(result.getQueryParameters().isEmpty());
    }
}