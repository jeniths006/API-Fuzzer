package com.example.API.Fuzzer.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
public class ScanSummaryDTO {
    private UUID scanId;
    private Long resultCount;

    public ScanSummaryDTO(UUID scanId, Long resultCount) {
        this.scanId = scanId;
        this.resultCount = resultCount;
    }
}
