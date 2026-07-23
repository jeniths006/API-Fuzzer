package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateQueryParameterRequestDTO;
import com.example.API.Fuzzer.dto.QueryParameterResponseDTO;
import com.example.API.Fuzzer.service.QueryParameterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QueryParameterController {

    private final QueryParameterService queryParameterService;

    public QueryParameterController(QueryParameterService queryParameterService) {
        this.queryParameterService = queryParameterService;
    }

    @PostMapping("/endpoints/{endpointId}/query-parameters")
    public ResponseEntity<QueryParameterResponseDTO> createQueryParameter(
            @PathVariable Long endpointId,
            @Valid @RequestBody CreateQueryParameterRequestDTO request) {

        QueryParameterResponseDTO response = queryParameterService.createQueryParameter(endpointId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/endpoints/{endpointId}/query-parameters")
    public ResponseEntity<List<QueryParameterResponseDTO>> getQueryParameters(@PathVariable Long endpointId) {
        return ResponseEntity.ok(queryParameterService.getQueryParameters(endpointId));
    }

    @PutMapping("/query-parameters/{QueryParameterId}")
    public ResponseEntity<QueryParameterResponseDTO> updateQueryParameter(
            @PathVariable Long QueryParameterId,
            @Valid @RequestBody CreateQueryParameterRequestDTO request
    ) {
        return ResponseEntity.ok(queryParameterService.updateQueryParameter(QueryParameterId, request));

    }

    @DeleteMapping("/query-parameters/{QueryParameterId}")
    public ResponseEntity<Void> deleteQueryParameter(@PathVariable Long QueryParameterId) {
        queryParameterService.deleteQueryParameter(QueryParameterId);
        return ResponseEntity.noContent().build();
    }
}


