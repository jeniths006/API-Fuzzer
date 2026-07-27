package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import com.example.API.Fuzzer.dto.FuzzRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.service.RequestExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RequestExecutionController {

    private final RequestExecutionService requestExecutionService;
    private final EndpointRepository endpointRepository;

    @PostMapping("/endpoints/{endpointId}/execute")
    public ExecutionResultDTO executeRequest(@PathVariable Long endpointId, @RequestBody BuiltRequestDTO builtRequestDTO) {
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));
        return requestExecutionService.execute(endpoint, builtRequestDTO);
    }
}
