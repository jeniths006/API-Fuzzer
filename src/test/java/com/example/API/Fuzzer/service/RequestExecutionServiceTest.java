package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.ExecutionResultRepository;
import com.example.API.Fuzzer.util.ContentType;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequestExecutionServiceTest {

    private MockWebServer mockWebServer;

    @Mock
    private RequestBuilderService requestBuilderService;

    @Mock
    private ExecutionResultRepository executionResultRepository;

    @Mock
    private EndpointRepository endpointRepository;

    private RequestExecutionService requestExecutionService;

    private BuiltRequestDTO builtRequestDTO;
    private Endpoint endpoint;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        String baseUrl = mockWebServer.url("/").toString();
        WebClient webClient = WebClient.builder().baseUrl(baseUrl).build();

        requestExecutionService = new RequestExecutionService(
                requestBuilderService, webClient, executionResultRepository, endpointRepository);

        builtRequestDTO = new BuiltRequestDTO(
                baseUrl + "test?param=1",
                com.example.API.Fuzzer.model.HttpMethod.POST,
                Map.of("Authorization", "Bearer token"),
                Map.of("param", "1"),
                "{\"key\":\"value\"}",
                ContentType.JSON
        );

        endpoint = new Endpoint();
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void execute_SuccessWithBody() {
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(requestBuilderService.buildRequest(10L)).thenReturn(builtRequestDTO);

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody("{\"status\":\"success\"}")
                .addHeader("Content-Type", "application/json"));

        ExecutionResultDTO result = requestExecutionService.execute(10L);

        assertNotNull(result);
        assertTrue(result.isSuccessful());
        assertEquals(200, result.getStatusCode());
        assertEquals("{\"status\":\"success\"}", result.getResponseBody());
        assertEquals(20, result.getResponseSize());
        assertTrue(result.getResponseTime() >= 0);

        verify(requestBuilderService, times(1)).buildRequest(10L);
        verify(endpointRepository, times(1)).findById(10L);

        // Verify what actually got persisted, not just what was returned
        ArgumentCaptor<ExecutionResult> captor = ArgumentCaptor.forClass(ExecutionResult.class);
        verify(executionResultRepository, times(1)).save(captor.capture());

        ExecutionResult saved = captor.getValue();
        assertEquals(endpoint, saved.getEndpoint());
        assertEquals(200, saved.getStatusCode());
        assertEquals("{\"status\":\"success\"}", saved.getResponseBody());
        assertEquals(20, saved.getResponseSize());
        assertTrue(saved.isSuccessful());
        // Regression check: responseTime must be set BEFORE save() is called
        assertTrue(saved.getResponseTime() >= 0);
        assertNotNull(saved.getExecutedAt());
    }

    @Test
    void execute_ErrorStatusCodeIsStillSuccessfulFalse() {
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(requestBuilderService.buildRequest(10L)).thenReturn(builtRequestDTO);

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(500)
                .setBody("{\"error\":\"internal\"}")
                .addHeader("Content-Type", "application/json"));

        ExecutionResultDTO result = requestExecutionService.execute(10L);

        assertNotNull(result);
        assertFalse(result.isSuccessful());
        assertEquals(500, result.getStatusCode());
        assertEquals("{\"error\":\"internal\"}", result.getResponseBody());

        verify(executionResultRepository, times(1)).save(any(ExecutionResult.class));
    }

    @Test
    void execute_ConnectionExceptionHandling() throws IOException {
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(requestBuilderService.buildRequest(10L)).thenReturn(builtRequestDTO);

        // Shut down the server immediately to force a connection refusal/failure
        mockWebServer.shutdown();

        ExecutionResultDTO result = requestExecutionService.execute(10L);

        assertNotNull(result);
        assertFalse(result.isSuccessful());
        assertEquals(0, result.getStatusCode());
        assertTrue(result.getResponseBody().contains("Connection failed")
                || result.getResponseBody().contains("Request failed"));

        ArgumentCaptor<ExecutionResult> captor = ArgumentCaptor.forClass(ExecutionResult.class);
        verify(executionResultRepository, times(1)).save(captor.capture());
        assertFalse(captor.getValue().isSuccessful());
        assertEquals(0, captor.getValue().getStatusCode());
    }

    @Test
    void execute_EndpointNotFound_ThrowsAndDoesNotCallDownstream() {
        when(endpointRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class,
                () -> requestExecutionService.execute(99L));

        // Should fail fast before ever building a request or saving anything
        verifyNoInteractions(requestBuilderService);
        verifyNoInteractions(executionResultRepository);
    }
}