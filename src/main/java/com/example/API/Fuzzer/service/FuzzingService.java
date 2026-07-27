package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.FuzzRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuzzingService {

    private final AttackPayloadRepository attackPayloadRepository;
    private final RequestExecutionService requestExecutionService;
    private final EndpointRepository endpointRepository;
    private final RequestBuilderService requestBuilderService;

    public void runScan(Long endpointId, FuzzRequestDTO requestDTO) {
        List<AttackPayload> payloads = attackPayloadRepository.findByCategoryIn(requestDTO.getCategories());

        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        for(AttackPayload payload : payloads) {
            BuiltRequestDTO fuzzedRequest = requestBuilderService.buildRequest(endpointId);
            fuzzedRequest.setBody(payload.getContent());
            requestExecutionService.execute(endpoint, fuzzedRequest);

        }
    }

}
