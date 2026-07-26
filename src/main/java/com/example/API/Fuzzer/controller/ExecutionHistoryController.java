package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.ExecutionHistoryResponseDTO;
import com.example.API.Fuzzer.service.ExecutionHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExecutionHistoryController {


    private final ExecutionHistoryService executionHistoryService;

    public ExecutionHistoryController(ExecutionHistoryService executionHistoryService) {
        this.executionHistoryService = executionHistoryService;
    }

    @GetMapping("/endpoints/{endpointId}/executions")
    public ResponseEntity<List<ExecutionHistoryResponseDTO>> getExecutionHistory(
            @PathVariable long endpointId
    ) {
        return ResponseEntity.ok(executionHistoryService.getExecutionHistory(endpointId));
    }
}
