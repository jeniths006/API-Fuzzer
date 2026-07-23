package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateEndpointRequestBodyRequestDTO;
import com.example.API.Fuzzer.dto.EndpointRequestBodyResponseDTO;
import com.example.API.Fuzzer.service.EndpointRequestBodyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RequestBodyController {

    private final EndpointRequestBodyService endpointRequestBodyService;

    public RequestBodyController(EndpointRequestBodyService EndpointRequestBodyService) {
        this.endpointRequestBodyService = EndpointRequestBodyService;
    }

    @PostMapping("/endpoints/{endpointId}/request-body")
    public ResponseEntity<EndpointRequestBodyResponseDTO> createRequestBody(
            @PathVariable Long endpointId,
            @Valid @RequestBody CreateEndpointRequestBodyRequestDTO request) {

        EndpointRequestBodyResponseDTO response = endpointRequestBodyService.createRequestBody(endpointId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/endpoints/{endpointId}/request-body")
    public ResponseEntity<EndpointRequestBodyResponseDTO> getRequestBody(@PathVariable Long endpointId) {
        return ResponseEntity.ok(endpointRequestBodyService.getRequestBody(endpointId));
    }

    @PutMapping("/request-body/{RequestBodyId}")
    public ResponseEntity<EndpointRequestBodyResponseDTO> updateRequestBody(
            @PathVariable Long RequestBodyId,
            @Valid @RequestBody CreateEndpointRequestBodyRequestDTO request
    ) {
        return ResponseEntity.ok(endpointRequestBodyService.updateRequestBody(RequestBodyId, request));

    }

    @DeleteMapping("/request-body/{RequestBodyId}")
    public ResponseEntity<Void> deleteRequestBody(@PathVariable Long RequestBodyId) {
        endpointRequestBodyService.deleteRequestBody(RequestBodyId);
        return ResponseEntity.noContent().build();
    }
}


