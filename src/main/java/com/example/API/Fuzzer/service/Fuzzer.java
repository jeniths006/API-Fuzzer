package com.example.API.Fuzzer.service;



import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.model.FuzzResult;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class Fuzzer {

    @Autowired
    private FuzzResultRepository fuzzResultRepository;

    @Autowired
    private AttackPayloadRepository attackPayloadRepository;



    private final WebClient webClient = WebClient.builder().build();

    public void fuzz(String targetUrl, AttackPayload payload) {
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
                    result.setStatusCode(entity.getStatusCode().value());
                    result.setResponseBody(entity.getBody());
                    long responseSize = entity.getBody() != null ? entity.getBody().length() : 0;
                    result.setResponseSize(responseSize);
                    long responseTime = endTime - startTime;
                    result.setResponseTime(responseTime);
                    result.setPayloadCategory(payload.getCategory());
                    fuzzResultRepository.save(result);

                        }
                );
    }

    public void fuzzAll(String url) {
        List<AttackPayload> payloads = attackPayloadRepository.findAll();
        for (AttackPayload payload : payloads) {
            fuzz(url, payload);

        }
    }

}
