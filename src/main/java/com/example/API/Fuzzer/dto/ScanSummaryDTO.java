package com.example.API.Fuzzer.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class ScanSummaryDTO {
    private UUID scanId;
    private Long resultCount;
    private LocalDateTime scanTime;
    private String endpointName;
    private Long projectId;

    public ScanSummaryDTO(UUID scanId, Long resultCount, LocalDateTime scanTime, String endpointName, Long projectId) {
        this.scanId = scanId;
        this.resultCount = resultCount;
        this.scanTime = scanTime;
        this.endpointName = endpointName;
        this.projectId = projectId;
    }
}
