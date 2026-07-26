package com.example.API.Fuzzer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionHistoryResponseDTO {
    private Long id;
    private int statusCode;
    private String responseBody;
    private long responseTime;
    private long responseSize;
    private boolean successful;
    private LocalDateTime executedAt;
}
