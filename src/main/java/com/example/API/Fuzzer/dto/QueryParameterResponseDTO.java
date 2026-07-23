package com.example.API.Fuzzer.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QueryParameterResponseDTO {

    private Long id;
    private String parameterName;
    private String parameterValue;
    private Long endpointId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
