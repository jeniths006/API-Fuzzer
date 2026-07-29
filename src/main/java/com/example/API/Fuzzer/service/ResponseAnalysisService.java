package com.example.API.Fuzzer.service;


import com.example.API.Fuzzer.model.AnalysisResult;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.AnalysisResultRepository;
import com.example.API.Fuzzer.service.analyzer.VulnerabilityAnalyzer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResponseAnalysisService {

    private final AnalysisResultRepository analysisResultRepository;

    private final List<VulnerabilityAnalyzer> analyzers;


    public void runAnalysis(ExecutionResult executionResult) {

        for(VulnerabilityAnalyzer analyzer : analyzers) {
            AnalysisResult result = analyzer.analyze(executionResult);

            analysisResultRepository.save(result);
        }
    }
}
