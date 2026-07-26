package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.ExecutionHistoryResponseDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.ExecutionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExecutionHistoryService {

    private final ExecutionResultRepository executionResultRepository;
    private final EndpointRepository endpointRepository;

    public List<ExecutionHistoryResponseDTO> getExecutionHistory(Long endpintId) {
        Endpoint endpoint = endpointRepository.findById(endpintId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        List<ExecutionResult> executionResults = executionResultRepository.findByEndpoint(endpoint);

        return executionResults.stream()
                .map(this::mapToExecutionHistoryResponseDTO)
                .toList();



    }

    private ExecutionHistoryResponseDTO mapToExecutionHistoryResponseDTO(ExecutionResult executionResult) {
        ExecutionHistoryResponseDTO executionHistoryResponseDTO = new ExecutionHistoryResponseDTO();
        executionHistoryResponseDTO.setId(executionResult.getId());
        executionHistoryResponseDTO.setStatusCode(executionResult.getStatusCode());
        executionHistoryResponseDTO.setResponseBody(executionResult.getResponseBody());
        executionHistoryResponseDTO.setResponseTime(executionResult.getResponseTime());
        executionHistoryResponseDTO.setResponseSize(executionResult.getResponseSize());
        executionHistoryResponseDTO.setSuccessful(executionResult.isSuccessful());
        executionHistoryResponseDTO.setExecutedAt(executionResult.getExecutedAt());

        return executionHistoryResponseDTO;
    }
}
