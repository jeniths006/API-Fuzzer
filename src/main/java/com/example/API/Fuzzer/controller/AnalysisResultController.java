package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.AnalysisResultDTO;
import com.example.API.Fuzzer.model.AnalysisResult;
import com.example.API.Fuzzer.repository.AnalysisResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnalysisResultController {

    private final AnalysisResultRepository analysisResultRepository;

    @GetMapping("/analysis-results/{executionResultId}")
    public List<AnalysisResultDTO> getAnalysisResultsByExecutionResult(@PathVariable Long executionResultId) {
        return analysisResultRepository.findByExecutionResultId(executionResultId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AnalysisResultDTO toDTO(AnalysisResult result) {
        AnalysisResultDTO dto = new AnalysisResultDTO();
        dto.setVulnerabilityType(result.getVulnerabilityType());
        dto.setSeverity(result.getSeverity() != null ? result.getSeverity().name() : null);
        dto.setConfidence(result.getConfidence());
        dto.setDetected(result.isDetected());
        dto.setEvidence(result.getEvidence());
        return dto;
    }
}
