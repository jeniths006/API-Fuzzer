package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.ExecutionResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExecutionResultRepository extends JpaRepository<ExecutionResult, Long> {
}
