package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.model.FuzzResult;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import com.example.API.Fuzzer.service.Fuzzer;
import com.example.API.Fuzzer.service.PayloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public String DeletePayload(@PathVariable Long id) {
        System.out.println(repo.existsById(id));
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "Payload with ID" + id + " deleted successfully.";
        }
        else {
            return "Payload not found";
        }
    }

    @PostMapping("/fuzz/{id}")
    public String fuzz(@PathVariable Long id, @RequestParam String targetUrl) {
        AttackPayload payload = payloadService.getPayloadById(id);
        fuzzer.fuzz(targetUrl, payload);
        return "Fuzzing attack initiated for payload ID: " + id + " against " + targetUrl;
    }

    @GetMapping("/results")
    public List<FuzzResult> getAllResults() {
        return fuzzResultRepository.findAll();
    }

    @PostMapping("/fuzz-all")
    public String fuzzAll(@RequestParam String targetUrl) {
        fuzzer.fuzzAll(targetUrl);
        return "Fuzzing All initiated for " + targetUrl;
    }
}
