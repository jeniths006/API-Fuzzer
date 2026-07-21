package com.example.API.Fuzzer.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateEndpointHeaderRequestDTO {

    @NotBlank(message = "Header name is required")
    private String headerName;

    @NotBlank(message = "Header value is required")
    private String headerValue;
}
