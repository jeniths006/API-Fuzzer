package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateEndpointHeaderRequestDTO;
import com.example.API.Fuzzer.dto.EndpointHeaderResponseDTO;
import com.example.API.Fuzzer.service.EndpointHeaderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EndpointHeaderController {

    private final EndpointHeaderService endpointHeaderService;

    public EndpointHeaderController(EndpointHeaderService endpointHeaderService) {
        this.endpointHeaderService = endpointHeaderService;
    }

    @PostMapping("/endpoints/{endpointId}/headers")
    public ResponseEntity<EndpointHeaderResponseDTO> createHeader(
            @PathVariable Long endpointId,
            @Valid @RequestBody CreateEndpointHeaderRequestDTO request) {

        EndpointHeaderResponseDTO response = endpointHeaderService.createHeader(endpointId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/endpoints/{endpointId}/headers")
    public ResponseEntity<List<EndpointHeaderResponseDTO>> getHeaders(@PathVariable Long endpointId) {
        return ResponseEntity.ok(endpointHeaderService.getHeaders(endpointId));
    }

    @PutMapping("/headers/{headerId}")
    public ResponseEntity<EndpointHeaderResponseDTO> updateHeader(
            @PathVariable Long headerId,
            @Valid @RequestBody CreateEndpointHeaderRequestDTO request
    ) {
        return ResponseEntity.ok(endpointHeaderService.updateHeader(headerId, request));

    }

    @DeleteMapping("/headers/{headerId}")
    public ResponseEntity<Void> deleteHeader(@PathVariable Long headerId) {
        endpointHeaderService.deleteHeader(headerId);
        return ResponseEntity.noContent().build();
    }
}


