package com.example.API.Fuzzer.service;



import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.model.FuzzResult;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class Fuzzer {

    @Autowired
    private FuzzResultRepository fuzzResultRepository;

    @Autowired
    private AttackPayloadRepository attackPayloadRepository;



    private final WebClient webClient = WebClient.builder().build();

    public void fuzz(String targetUrl, AttackPayload payload, UUID scanId) {
        long startTime = System.currentTimeMillis();
        webClient.post()
                .uri(targetUrl)
                .bodyValue(payload.getContent())
                .retrieve()
                .toEntity(String.class)

                .subscribe(entity -> {
                    long endTime = System.currentTimeMillis();
                    FuzzResult result = new FuzzResult();
                    result.setTargetUrl(targetUrl);
                    result.setPayloadContent(payload.getContent());
                    result.setPayloadCategory(payload.getCategory());
                    result.setStatusCode(entity.getStatusCode().value());
                    result.setResponseBody(entity.getBody());
                    long responseSize = entity.getBody() != null ? entity.getBody().length() : 0;
                    result.setResponseSize(responseSize);
                    long responseTime = endTime - startTime;
                    result.setResponseTime(responseTime);
                    result.setHttpMethod("POST");
                    result.setTimestamp(LocalDateTime.now());
                    result.setScanId(scanId);
                    fuzzResultRepository.save(result);
                    }, error -> {

                    FuzzResult result = new FuzzResult();
                    result.setTargetUrl(targetUrl);
                    result.setPayloadContent(payload.getContent());
                    result.setPayloadCategory(payload.getCategory());
                    result.setStatusCode(-1);
                    result.setResponseBody(error.getMessage());
                    result.setHttpMethod("POST");
                    result.setTimestamp(LocalDateTime.now());
                    result.setScanId(scanId);
                    fuzzResultRepository.save(result);

                    }

                );
    }

    public void fuzzAll(String url) {
        UUID scanId = UUID.randomUUID();
        List<AttackPayload> payloads = attackPayloadRepository.findAll();
        for (AttackPayload payload : payloads) {
            fuzz(url, payload, scanId);

        }
    }

}
