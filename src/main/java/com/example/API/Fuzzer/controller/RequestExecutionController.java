package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.service.RequestExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RequestExecutionController {

    private final RequestExecutionService requestExecutionService;

    @PostMapping("/endpoints/{endpointId}/execute")
    public String executeRequest(@PathVariable Long endpointId) {
        return requestExecutionService.execute(endpointId);
    }
}
