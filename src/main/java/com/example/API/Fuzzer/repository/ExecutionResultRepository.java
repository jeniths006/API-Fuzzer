package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.ExecutionResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExecutionResultRepository extends JpaRepository<ExecutionResult, Long> {
    List<ExecutionResult> findByEndpoint(Endpoint endpoint);
}
