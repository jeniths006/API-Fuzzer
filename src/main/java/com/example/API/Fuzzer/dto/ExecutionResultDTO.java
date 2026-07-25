package com.example.API.Fuzzer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpHeaders;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionResultDTO {

    private int statusCode;
    private String responseBody;
    private long responseTime;
    private long responseSize;
    private HttpHeaders responseHeaders;
    private boolean successful;
}
