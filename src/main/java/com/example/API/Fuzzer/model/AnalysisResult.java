package com.example.API.Fuzzer.model;

import aQute.bnd.annotation.licenses.LGPL_2_1_only;
import com.example.API.Fuzzer.service.analyzer.VulnerabilitySeverity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ExecutionResult executionResult;

    private String vulnerabilityType;

    private VulnerabilitySeverity severity;

    private int confidence;
    private boolean detected;
    @Lob
    private String evidence;
}
