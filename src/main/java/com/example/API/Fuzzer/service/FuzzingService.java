package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import com.example.API.Fuzzer.dto.FuzzRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.FuzzResult;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.ExecutionResultRepository;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FuzzingService {

    private final AttackPayloadRepository attackPayloadRepository;
    private final RequestExecutionService requestExecutionService;
    private final EndpointRepository endpointRepository;
    private final RequestBuilderService requestBuilderService;
    private final FuzzResultRepository fuzzResultRepository;
    private final ResponseAnalysisService responseAnalysisService;
    private final ExecutionResultRepository executionResultRepository;

    public void runScan(Long endpointId, FuzzRequestDTO requestDTO) {
        List<AttackPayload> payloads = attackPayloadRepository.findByCategoryIn(requestDTO.getCategories());

        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        UUID scanId = UUID.randomUUID();

        for (AttackPayload payload : payloads) {
            BuiltRequestDTO fuzzedRequest = requestBuilderService.buildRequest(endpointId);
            fuzzedRequest.setBody(payload.getContent());
            ExecutionResultDTO result = requestExecutionService.execute(endpoint, fuzzedRequest);

            // Save execution result for analysis
            ExecutionResult executionResult = new ExecutionResult();
            executionResult.setEndpoint(endpoint);
            executionResult.setStatusCode(result.getStatusCode());
            executionResult.setResponseBody(result.getResponseBody());
            executionResult.setResponseTime(result.getResponseTime());
            executionResult.setResponseSize(result.getResponseSize());
            executionResult.setSuccessful(result.getStatusCode() >= 200 && result.getStatusCode() < 300);
            executionResult.setExecutedAt(LocalDateTime.now());
            executionResult = executionResultRepository.save(executionResult);

            // Run vulnerability analysis
            responseAnalysisService.runAnalysis(executionResult);

            FuzzResult fuzzResult = new FuzzResult();
            fuzzResult.setScanId(scanId);
            fuzzResult.setTargetUrl(fuzzedRequest.getUrl());
            fuzzResult.setPayloadContent(payload.getContent());
            fuzzResult.setPayloadCategory(payload.getCategory());
            fuzzResult.setHttpMethod(endpoint.getMethod().name());
            fuzzResult.setStatusCode(result.getStatusCode());
            fuzzResult.setResponseBody(result.getResponseBody());
            fuzzResult.setResponseTime(result.getResponseTime());
            fuzzResult.setResponseSize(result.getResponseSize());
            fuzzResult.setTimestamp(LocalDateTime.now());
            fuzzResult.setExecutionResult(executionResult);
            fuzzResultRepository.save(fuzzResult);
        }
    }

}
