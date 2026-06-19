package com.example.API.Fuzzer.service;



import com.example.API.Fuzzer.model.FuzzResult;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class Fuzzer {

    @Autowired
    private FuzzResultRepository fuzzResultRepository;
    private final WebClient webClient = WebClient.builder().build();

    public void fuzz(String targetUrl, String payloadContent) {
        webClient.post()
                .uri(targetUrl)
                .bodyValue(payloadContent)
                .retrieve()
                .toEntity(String.class)
                .subscribe(entity -> {
                    FuzzResult result = new FuzzResult();
                    result.setTargetUrl(targetUrl);
                    result.setPayloadContent(payloadContent);
                    result.setStatusCode(entity.getStatusCode().value());
                    result.setResponseBody(entity.getBody());
                    fuzzResultRepository.save(result);
                        }
                );
    }

}
