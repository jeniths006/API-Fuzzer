package com.example.API.Fuzzer.service.analyzer;

import com.example.API.Fuzzer.model.AnalysisResult;
import com.example.API.Fuzzer.model.ExecutionResult;
import org.springframework.stereotype.Service;

import static com.example.API.Fuzzer.service.analyzer.VulnerabilitySeverity.HIGH;
import static com.example.API.Fuzzer.service.analyzer.VulnerabilitySeverity.LOW;

@Service
public class SQLInjectionAnalyzerService implements VulnerabilityAnalyzer{

    @Override
    public AnalysisResult analyze(ExecutionResult executionResult) {

        AnalysisResult result = new AnalysisResult();

        result.setExecutionResult(executionResult);
        result.setVulnerabilityType("SQL Injection");
        result.setSeverity(LOW);
        result.setConfidence(0);
        result.setDetected(false);

        String response = executionResult.getResponseBody();

        if (response == null) {
            return result;
        }

        String body = response.toLowerCase();

        if (body.contains("sql syntax")
                || body.contains("mysql")
                || body.contains("postgres")
                || body.contains("sqlite")
                || body.contains("oracle")
                || body.contains("jdbc")
                || body.contains("odbc")
                || body.contains("syntax error")) {

            result.setDetected(true);
            result.setSeverity(HIGH);
            result.setConfidence(90);
            result.setEvidence("Database error message exposed in response");
        }

        return result;


    }
}
