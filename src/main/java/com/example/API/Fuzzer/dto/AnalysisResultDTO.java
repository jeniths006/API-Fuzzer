package com.example.API.Fuzzer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResultDTO {

    private String vulnerabilityType;
    private String severity;
    private int confidence;
    private boolean detected;
    private String evidence;
}
