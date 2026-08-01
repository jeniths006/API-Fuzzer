package com.example.API.Fuzzer.controller;


import com.example.API.Fuzzer.dto.FuzzRequestDTO;
import com.example.API.Fuzzer.service.FuzzingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fuzz")
@RequiredArgsConstructor
public class FuzzingController {

    private final FuzzingService fuzzingService;

    @PostMapping("/{endpointId}/run")
    public ResponseEntity<String> runScan(
            @PathVariable Long endpointId,
            @RequestBody FuzzRequestDTO requestDTO) {

        fuzzingService.runScan(endpointId, requestDTO);

        return ResponseEntity.ok("Scan Completed.");
    }
}
