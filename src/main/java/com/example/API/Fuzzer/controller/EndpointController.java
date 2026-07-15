package com.example.API.Fuzzer.controller;


import com.example.API.Fuzzer.dto.CreateEndpointRequestDTO;
import com.example.API.Fuzzer.dto.EndpointResponseDTO;
import com.example.API.Fuzzer.service.EndpointService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EndpointController {

    private final EndpointService endpointService;

    public EndpointController(EndpointService endpointService) {
        this.endpointService = endpointService;
    }


    @PostMapping("/projects/{projectId}/endpoints")
    public ResponseEntity<EndpointResponseDTO> createEndpoint(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateEndpointRequestDTO request) {

        EndpointResponseDTO response = endpointService.createEndpoint(projectId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }



    @GetMapping("/projects/{projectId}/endpoints")
    public ResponseEntity<List<EndpointResponseDTO>> getEndpoints(@PathVariable Long projectId) {
        return ResponseEntity.ok(endpointService.getEndpoints(projectId));
    }

    @GetMapping("/endpoints/{endpointId}")
    public ResponseEntity<EndpointResponseDTO> getEndpoint(
        @PathVariable Long endpointId) {

        return ResponseEntity.ok(endpointService.getEndpoint(endpointId));
    }


    @PutMapping("/endpoints/{endpointId}")
    public ResponseEntity<EndpointResponseDTO> updateEndpoint(
            @PathVariable Long endpointId,
            @Valid @RequestBody CreateEndpointRequestDTO request) {

        return ResponseEntity.ok(endpointService.updateEndpoint(endpointId, request));
    }

    @DeleteMapping("/endpoints/{endpointId}")
    public ResponseEntity<Void> deleteEndpoint(@PathVariable long endpointId) {

        endpointService.deleteEndpoint(endpointId);

        return ResponseEntity.noContent().build();
    }



}
