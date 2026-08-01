package com.example.API.Fuzzer.repository;


import com.example.API.Fuzzer.model.AnalysisResult;
import com.example.API.Fuzzer.model.ExecutionResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {

    List<AnalysisResult> findByExecutionResult(ExecutionResult executionResult);

    List<AnalysisResult> findByExecutionResultId(Long executionResultId);

}
