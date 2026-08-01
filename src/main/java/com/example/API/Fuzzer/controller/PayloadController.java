package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.model.FuzzResult;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import com.example.API.Fuzzer.service.Fuzzer;
import com.example.API.Fuzzer.service.PayloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/payloads")
public class PayloadController {
    @Autowired
    private PayloadService payloadService;
    @Autowired
    private AttackPayloadRepository repo;
    @Autowired
    private FuzzResultRepository fuzzResultRepository;

    @Autowired
    private Fuzzer fuzzer;

    @GetMapping
    public List<AttackPayload> getPayloads(){
        List<AttackPayload> payloads = payloadService.getAllPayloads();
        System.out.println("Payload found: " + payloads.size());
        return payloads;
    }

    @PostMapping
    public AttackPayload addPayload(@RequestBody AttackPayload payload) {
        return payloadService.savePayload(payload);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> DeletePayload(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        if (repo.existsById(id)) {
            repo.deleteById(id);
            response.put("message", "Payload with ID " + id + " deleted successfully.");
            return response;
        }
        else {
            response.put("message", "Payload not found");
            return response;
        }
    }



    @GetMapping("/results")
    public List<FuzzResult> getAllResults() {
        return fuzzResultRepository.findAll();
    }



    @GetMapping("/results/scan/{scanId}")
    public List<FuzzResult> getResultsByScanId(@PathVariable UUID scanId) {
        return fuzzResultRepository.findByscanId(scanId);
    }
}