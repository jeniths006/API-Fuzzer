package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;
import reactor.core.publisher.Mono;

import java.net.ConnectException;
import java.net.URI;
import java.time.Duration;
import java.util.concurrent.TimeoutException;

@Service
@RequiredArgsConstructor
public class RequestExecutionService {

    private final RequestBuilderService requestBuilderService;
    private final WebClient webClient;

    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(15);

    public ExecutionResultDTO execute(Long endpointId) {
        BuiltRequestDTO builtRequestDTO = requestBuilderService.buildRequest(endpointId);
        HttpMethod httpMethod = HttpMethod.valueOf(builtRequestDTO.getMethod().name());

        long startTime = System.currentTimeMillis();

        var initRequest = webClient
                .method(httpMethod)
                .uri(uriBuilder -> {
                    URI uri = URI.create(builtRequestDTO.getUrl());

                    UriBuilder builder = uriBuilder
                            .scheme(uri.getScheme())
                            .host(uri.getHost())
                            .port(uri.getPort()) // preserve non-default ports; -1 = default, which is fine
                            .path(uri.getPath());

                    builtRequestDTO.getQueryParameters().forEach(builder::queryParam);

                    return builder.build();
                })
                .headers(headers ->
                        builtRequestDTO.getHeaders().forEach(headers::add));

        var finalRequest = (builtRequestDTO.getBody() != null)
                ? initRequest
                .header(HttpHeaders.CONTENT_TYPE, builtRequestDTO.getContentType().getValue())
                .bodyValue(builtRequestDTO.getBody())
                : initRequest;

        try {
            ExecutionResultDTO result = finalRequest
                    .exchangeToMono(this::toExecutionResultDTO)
                    .timeout(REQUEST_TIMEOUT)
                    .block();

            result.setResponseTime(System.currentTimeMillis() - startTime);
            return result;

        } catch (Exception ex) {
            long responseTime = System.currentTimeMillis() - startTime;
            return buildErrorResult(ex, responseTime);
        }
    }

    private Mono<ExecutionResultDTO> toExecutionResultDTO(ClientResponse response) {
        return response.bodyToMono(String.class)
                .defaultIfEmpty("")
                .map(body -> {
                    ExecutionResultDTO dto = new ExecutionResultDTO();
                    HttpStatusCode status = response.statusCode();
                    dto.setStatusCode(status.value());
                    dto.setResponseBody(body);
                    dto.setResponseSize(body.length());
                    dto.setResponseHeaders(response.headers().asHttpHeaders());
                    dto.setSuccessful(status.is2xxSuccessful());
                    return dto;
                });
    }

    private ExecutionResultDTO buildErrorResult(Throwable ex, long responseTime) {
        ExecutionResultDTO dto = new ExecutionResultDTO();
        dto.setStatusCode(0);
        dto.setSuccessful(false);
        dto.setResponseTime(responseTime);
        dto.setResponseSize(0);

        String reason = (ex instanceof TimeoutException)
                ? "Request timed out after " + REQUEST_TIMEOUT.getSeconds() + "s"
                : (ex.getCause() instanceof ConnectException || ex instanceof ConnectException)
                  ? "Connection failed: " + ex.getMessage()
                  : "Request failed: " + ex.getMessage();

        dto.setResponseBody(reason);
        return dto;
    }
}