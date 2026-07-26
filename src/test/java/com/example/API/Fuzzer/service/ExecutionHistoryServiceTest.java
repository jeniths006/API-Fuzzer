package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.ExecutionHistoryResponseDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.ExecutionResultRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExecutionHistoryServiceTest {

    @Mock
    private ExecutionResultRepository executionResultRepository;

    @Mock
    private EndpointRepository endpointRepository;

    @InjectMocks
    private ExecutionHistoryService executionHistoryService;

    @Test
    void getExecutionHistory_ReturnsMappedResults() {
        Endpoint endpoint = new Endpoint();
        when(endpointRepository.findById(1L)).thenReturn(Optional.of(endpoint));

        LocalDateTime now = LocalDateTime.now();

        ExecutionResult result1 = new ExecutionResult();
        result1.setId(100L);
        result1.setEndpoint(endpoint);
        result1.setStatusCode(200);
        result1.setResponseBody("{\"ok\":true}");
        result1.setResponseTime(150L);
        result1.setResponseSize(12L);
        result1.setSuccessful(true);
        result1.setExecutedAt(now);

        ExecutionResult result2 = new ExecutionResult();
        result2.setId(101L);
        result2.setEndpoint(endpoint);
        result2.setStatusCode(500);
        result2.setResponseBody("error");
        result2.setResponseTime(300L);
        result2.setResponseSize(5L);
        result2.setSuccessful(false);
        result2.setExecutedAt(now);

        when(executionResultRepository.findByEndpoint(endpoint))
                .thenReturn(List.of(result1, result2));

        List<ExecutionHistoryResponseDTO> history = executionHistoryService.getExecutionHistory(1L);

        assertEquals(2, history.size());

        ExecutionHistoryResponseDTO dto1 = history.get(0);
        assertEquals(100L, dto1.getId());
        assertEquals(200, dto1.getStatusCode());
        assertEquals("{\"ok\":true}", dto1.getResponseBody());
        assertEquals(150L, dto1.getResponseTime());
        assertEquals(12L, dto1.getResponseSize());
        assertTrue(dto1.isSuccessful());
        assertEquals(now, dto1.getExecutedAt());

        ExecutionHistoryResponseDTO dto2 = history.get(1);
        assertEquals(101L, dto2.getId());
        assertEquals(500, dto2.getStatusCode());
        assertFalse(dto2.isSuccessful());

        verify(endpointRepository, times(1)).findById(1L);
        verify(executionResultRepository, times(1)).findByEndpoint(endpoint);
    }

    @Test
    void getExecutionHistory_NoResults_ReturnsEmptyList() {
        Endpoint endpoint = new Endpoint();
        when(endpointRepository.findById(1L)).thenReturn(Optional.of(endpoint));
        when(executionResultRepository.findByEndpoint(endpoint)).thenReturn(List.of());

        List<ExecutionHistoryResponseDTO> history = executionHistoryService.getExecutionHistory(1L);

        assertNotNull(history);
        assertTrue(history.isEmpty());
    }

    @Test
    void getExecutionHistory_EndpointNotFound_ThrowsAndSkipsRepository() {
        when(endpointRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class,
                () -> executionHistoryService.getExecutionHistory(99L));

        verifyNoInteractions(executionResultRepository);
    }
}