package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.ExecutionResultRepository;
import com.example.API.Fuzzer.util.ContentType;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequestExecutionServiceTest {

    private MockWebServer mockWebServer;

    @Mock
    private RequestBuilderService requestBuilderService;

    @Mock
    private ExecutionResultRepository executionResultRepository;

    @Mock
    private ResponseAnalysisService responseAnalysisService;

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
                requestBuilderService, webClient, executionResultRepository, responseAnalysisService);

        endpoint = new Endpoint();
        endpoint.setId(10L);

        builtRequestDTO = new BuiltRequestDTO(
                endpoint.getId(),
                baseUrl + "test?param=1",
                com.example.API.Fuzzer.model.HttpMethod.POST,
                Map.of("Authorization", "Bearer token"),
                Map.of("param", "1"),
                "{\"key\":\"value\"}",
                ContentType.JSON
        );

        when(executionResultRepository.save(any(ExecutionResult.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void execute_SuccessWithBody() {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody("{\"status\":\"success\"}")
                .addHeader("Content-Type", "application/json"));

        ExecutionResultDTO result = requestExecutionService.execute(endpoint, builtRequestDTO);

        assertNotNull(result);
        assertTrue(result.isSuccessful());
        assertEquals(200, result.getStatusCode());
        assertEquals("{\"status\":\"success\"}", result.getResponseBody());
        assertEquals(20, result.getResponseSize());
        assertTrue(result.getResponseTime() >= 0);

        // Verify invocations using strictly generic matchers to avoid equals/hashCode conflicts
        verify(executionResultRepository, times(1)).save(any(ExecutionResult.class));
        verify(responseAnalysisService, times(1)).runAnalysis(any(ExecutionResult.class));
    }

    @Test
    void execute_ErrorStatusCodeIsStillSuccessfulFalse() {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(500)
                .setBody("{\"error\":\"internal\"}")
                .addHeader("Content-Type", "application/json"));

        ExecutionResultDTO result = requestExecutionService.execute(endpoint, builtRequestDTO);

        assertNotNull(result);
        assertFalse(result.isSuccessful());
        assertEquals(500, result.getStatusCode());
        assertEquals("{\"error\":\"internal\"}", result.getResponseBody());

        verify(executionResultRepository, times(1)).save(any(ExecutionResult.class));
        verify(responseAnalysisService, times(1)).runAnalysis(any(ExecutionResult.class));
    }

    @Test
    void execute_ConnectionExceptionHandling() throws IOException {
        mockWebServer.shutdown();

        ExecutionResultDTO result = requestExecutionService.execute(endpoint, builtRequestDTO);

        assertNotNull(result);
        assertFalse(result.isSuccessful());
        assertEquals(0, result.getStatusCode());
        assertTrue(result.getResponseBody().contains("Connection failed")
                || result.getResponseBody().contains("Request failed"));

        verify(executionResultRepository, times(1)).save(any(ExecutionResult.class));
        verify(responseAnalysisService, times(1)).runAnalysis(any(ExecutionResult.class));
    }
}