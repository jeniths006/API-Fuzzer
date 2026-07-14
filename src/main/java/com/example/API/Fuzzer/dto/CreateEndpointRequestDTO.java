package com.example.API.Fuzzer.dto;

import com.example.API.Fuzzer.model.HttpMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateEndpointRequestDTO {

    @NotBlank(message = "Endpoint name is required")
    private String name;

    @NotNull(message = "Method is required")
    private HttpMethod method;

    @NotBlank(message = "Endpoint URL is required")
    private String url;
}
