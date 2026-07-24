package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;

import java.net.URI;

@Service
@RequiredArgsConstructor
public class RequestExecutionService {

    private final RequestBuilderService requestBuilderService;
    private final WebClient webClient;

    public String execute(Long endpointId) {
        BuiltRequestDTO builtRequestDTO = requestBuilderService.buildRequest(endpointId);

        HttpMethod httpMethod = HttpMethod.valueOf(builtRequestDTO.getMethod().name());

        if(builtRequestDTO.getBody() != null) {
            var response =  webClient
                    .method(httpMethod)
                    .uri(uriBuilder -> {
                        URI uri = URI.create(builtRequestDTO.getUrl());

                        UriBuilder builder = uriBuilder
                                .scheme(uri.getScheme())
                                .host(uri.getHost())
                                .path(uri.getPath());

                        builtRequestDTO.getQueryParameters().forEach(builder::queryParam);

                        return builder.build();
                    })
                    .headers(headers ->
                            builtRequestDTO.getHeaders().forEach(headers::add))
                    .header(HttpHeaders.CONTENT_TYPE, builtRequestDTO.getContentType().getValue())
                    .bodyValue(builtRequestDTO.getBody())
                    .retrieve()
                    .toEntity(String.class)
                    .block();

            return response != null ? response.getBody() : null;
        }
        else {
            var response = webClient
                    .method(httpMethod)
                    .uri(uriBuilder -> {
                        URI uri = URI.create(builtRequestDTO.getUrl());

                        UriBuilder builder = uriBuilder
                                .scheme(uri.getScheme())
                                .host(uri.getHost())
                                .path(uri.getPath());

                        builtRequestDTO.getQueryParameters().forEach(builder::queryParam);

                        return builder.build();
                    })
                    .headers(headers ->
                            builtRequestDTO.getHeaders().forEach(headers::add))
                    .retrieve()
                    .toEntity(String.class)
                    .block();

            return response != null ? response.getBody() : null;

        }
    }
}
