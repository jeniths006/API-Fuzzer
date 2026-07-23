package com.example.API.Fuzzer.dto;

import com.example.API.Fuzzer.util.ContentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateEndpointRequestBodyRequestDTO {
    private String content;
    private ContentType contentType;
}
