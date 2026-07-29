package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.model.AnalysisResult;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.AnalysisResultRepository;
import com.example.API.Fuzzer.service.analyzer.VulnerabilityAnalyzer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResponseAnalysisServiceTest {

    @Mock
    private AnalysisResultRepository analysisResultRepository;

    @Mock
    private VulnerabilityAnalyzer analyzerOne;

    @Mock
    private VulnerabilityAnalyzer analyzerTwo;

    private ResponseAnalysisService responseAnalysisService;

    private ExecutionResult executionResult;
    private AnalysisResult analysisResultOne;
    private AnalysisResult analysisResultTwo;

    @BeforeEach
    void setUp() {
        responseAnalysisService = new ResponseAnalysisService(
                analysisResultRepository,
                List.of(analyzerOne, analyzerTwo)
        );

        executionResult = new ExecutionResult();
        executionResult.setId(1L);

        analysisResultOne = new AnalysisResult();
        analysisResultOne.setId(10L);

        analysisResultTwo = new AnalysisResult();
        analysisResultTwo.setId(20L);
    }

    @Test
    void runAnalysis_ExecutesAllAnalyzersAndSavesResults() {
        // Stub save here since this test actually calls repository.save()
        when(analysisResultRepository.save(any(AnalysisResult.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(analyzerOne.analyze(executionResult)).thenReturn(analysisResultOne);
        when(analyzerTwo.analyze(executionResult)).thenReturn(analysisResultTwo);

        responseAnalysisService.runAnalysis(executionResult);

        verify(analyzerOne, times(1)).analyze(executionResult);
        verify(analyzerTwo, times(1)).analyze(executionResult);

        verify(analysisResultRepository, times(2)).save(any(AnalysisResult.class));
        verify(analysisResultRepository, times(1)).save(analysisResultOne);
        verify(analysisResultRepository, times(1)).save(analysisResultTwo);
    }

    @Test
    void runAnalysis_EmptyAnalyzersList_DoesNotSaveAnything() {
        ResponseAnalysisService emptyService = new ResponseAnalysisService(
                analysisResultRepository,
                List.of()
        );

        emptyService.runAnalysis(executionResult);

        verifyNoInteractions(analysisResultRepository);
    }
}