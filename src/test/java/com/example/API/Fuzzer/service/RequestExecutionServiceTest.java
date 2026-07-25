package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import com.example.API.Fuzzer.util.ContentType;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequestExecutionServiceTest {

    private MockWebServer mockWebServer;

    @Mock
    private RequestBuilderService requestBuilderService;

    private RequestExecutionService requestExecutionService;

    private BuiltRequestDTO builtRequestDTO;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        // Create a real WebClient pointing to our local MockWebServer
        String baseUrl = mockWebServer.url("/").toString();
        WebClient webClient = WebClient.builder().baseUrl(baseUrl).build();

        requestExecutionService = new RequestExecutionService(requestBuilderService, webClient);

        builtRequestDTO = new BuiltRequestDTO(
                baseUrl + "test?param=1",
                com.example.API.Fuzzer.model.HttpMethod.POST,
                Map.of("Authorization", "Bearer token"),
                Map.of("param", "1"),
                "{\"key\":\"value\"}",
                ContentType.JSON
        );
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void execute_SuccessWithBody() {
        when(requestBuilderService.buildRequest(10L)).thenReturn(builtRequestDTO);

        // Enqueue a successful mock response on our local server
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
    }

    @Test
    void execute_ConnectionExceptionHandling() {
        when(requestBuilderService.buildRequest(10L)).thenReturn(builtRequestDTO);

        // Shut down the server immediately to force a connection refusal/failure
        try {
            mockWebServer.shutdown();
        } catch (IOException ignored) {}

        ExecutionResultDTO result = requestExecutionService.execute(10L);

        assertNotNull(result);
        assertFalse(result.isSuccessful());
        assertEquals(0, result.getStatusCode());
        assertTrue(result.getResponseBody().contains("Connection failed") || result.getResponseBody().contains("Request failed"));
    }
}