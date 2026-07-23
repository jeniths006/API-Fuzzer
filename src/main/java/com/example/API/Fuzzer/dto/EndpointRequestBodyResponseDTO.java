package com.example.API.Fuzzer.dto;

import com.example.API.Fuzzer.util.ContentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EndpointRequestBodyResponseDTO {

    private Long id;
    private String content;
    private ContentType contentType;
    private Long endpointId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
