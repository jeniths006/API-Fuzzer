package com.example.API.Fuzzer.dto;

import com.example.API.Fuzzer.model.HttpMethod;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EndpointResponseDTO {

    private Long id;
    private String name;
    private HttpMethod httpMethod;
    private String url;
    private Long projectId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
