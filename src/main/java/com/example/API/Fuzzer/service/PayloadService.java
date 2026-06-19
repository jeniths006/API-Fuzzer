package com.example.API.Fuzzer.service;


import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayloadService {

    @Autowired
    public AttackPayloadRepository repo;

    public List<AttackPayload> getAllPayloads() {
        return repo.findAll();
    }

    public AttackPayload savePayload(AttackPayload payload) {
        return repo.save(payload);
    }

    public AttackPayload getPayloadById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Payload not found"));
    }
}
