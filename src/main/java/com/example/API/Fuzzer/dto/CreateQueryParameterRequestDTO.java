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
public class CreateQueryParameterRequestDTO {

    @NotBlank(message = "Parameter name is required")
    private String parameterName;

    @NotBlank(message = "Parameter value is required")
    private String parameterValue;
}
