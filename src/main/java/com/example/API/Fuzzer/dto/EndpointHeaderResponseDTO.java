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
public class EndpointHeaderResponseDTO {

    private Long id;
    private String headerName;
    private String headerValue;
    private Long endpointId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
