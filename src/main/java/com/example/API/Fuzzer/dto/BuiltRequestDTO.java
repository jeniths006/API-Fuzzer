package com.example.API.Fuzzer.dto;

import com.example.API.Fuzzer.model.HttpMethod;
import com.example.API.Fuzzer.util.ContentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuiltRequestDTO {

    private String url;
    private HttpMethod method;
    private Map<String, String> headers;
    private Map<String, String> queryParameters;
    private String body;
    private ContentType contentType;
}
