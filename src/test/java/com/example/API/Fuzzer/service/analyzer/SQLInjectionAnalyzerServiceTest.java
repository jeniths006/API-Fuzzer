package com.example.API.Fuzzer.service.analyzer;

import com.example.API.Fuzzer.model.AnalysisResult;
import com.example.API.Fuzzer.model.ExecutionResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static com.example.API.Fuzzer.service.analyzer.VulnerabilitySeverity.HIGH;
import static com.example.API.Fuzzer.service.analyzer.VulnerabilitySeverity.LOW;
import static org.junit.jupiter.api.Assertions.*;

class SQLInjectionAnalyzerServiceTest {

    private SQLInjectionAnalyzerService analyzerService;
    private ExecutionResult executionResult;

    @BeforeEach
    void setUp() {
        analyzerService = new SQLInjectionAnalyzerService();
        executionResult = new ExecutionResult();
        executionResult.setId(1L);
    }

    @Test
    void analyze_NullResponseBody_ReturnsNotDetected() {
        executionResult.setResponseBody(null);

        AnalysisResult result = analyzerService.analyze(executionResult);

        assertNotNull(result);
        assertEquals(executionResult, result.getExecutionResult());
        assertEquals("SQL Injection", result.getVulnerabilityType());
        assertFalse(result.isDetected());
        assertEquals(LOW, result.getSeverity());
        assertEquals(0, result.getConfidence());
        assertNull(result.getEvidence());
    }

    @Test
    void analyze_SafeResponseBody_ReturnsNotDetected() {
        executionResult.setResponseBody("Welcome to the homepage! Everything is normal.");

        AnalysisResult result = analyzerService.analyze(executionResult);

        assertNotNull(result);
        assertFalse(result.isDetected());
        assertEquals(LOW, result.getSeverity());
        assertEquals(0, result.getConfidence());
        assertNull(result.getEvidence());
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "You have an error in your SQL syntax",
            "Warning: mysql_query() expects parameter",
            "PostgreSQL query failed: ERROR",
            "SQLite/JDBCDriver connection exception",
            "Oracle error: ORA-00933",
            "Unrecognized ODBC escape sequence",
            "syntax error in query expression"
    })
    void analyze_VulnerableResponseBody_DetectsSqlInjection(String errorSnippet) {
        // Test with different cases to verify .toLowerCase() handling
        executionResult.setResponseBody("Response contains: " + errorSnippet.toUpperCase());

        AnalysisResult result = analyzerService.analyze(executionResult);

        assertNotNull(result);
        assertTrue(result.isDetected());
        assertEquals(HIGH, result.getSeverity());
        assertEquals(90, result.getConfidence());
        assertEquals("Database error message exposed in response", result.getEvidence());
        assertEquals("SQL Injection", result.getVulnerabilityType());
        assertEquals(executionResult, result.getExecutionResult());
    }
}