package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.ExecutionResultDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.ExecutionResult;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.ExecutionResultRepository;
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
import java.time.LocalDateTime;
import java.util.concurrent.TimeoutException;

@Service
@RequiredArgsConstructor
public class RequestExecutionService {

    private final RequestBuilderService requestBuilderService;
    private final WebClient webClient;
    private final ExecutionResultRepository executionResultRepository;

    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(15);
    private final EndpointRepository endpointRepository;

    public ExecutionResultDTO execute(Long endpointId) {
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));
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
            long responseTime = System.currentTimeMillis() - startTime;
            result.setResponseTime(responseTime);

            saveExecutionResult(endpoint, result);



            return result;

        } catch (Exception ex) {
            long responseTime = System.currentTimeMillis() - startTime;
            ExecutionResultDTO executionResultDTO = buildErrorResult(ex, responseTime);

            saveExecutionResult(endpoint, executionResultDTO);

            return executionResultDTO;

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

    private void saveExecutionResult(Endpoint endpoint, ExecutionResultDTO executionResultDTO) {
        ExecutionResult executionResult = new ExecutionResult();
        executionResult.setEndpoint(endpoint);
        executionResult.setStatusCode(executionResultDTO.getStatusCode());
        executionResult.setResponseBody(executionResultDTO.getResponseBody());
        executionResult.setResponseTime(executionResultDTO.getResponseTime());
        executionResult.setResponseSize(executionResultDTO.getResponseSize());
        executionResult.setSuccessful(executionResultDTO.isSuccessful());
        executionResult.setExecutedAt(LocalDateTime.now());
        executionResultRepository.save(executionResult);
    }
}