package com.example.API.Fuzzer.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
public class FuzzResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String targetUrl;
    private String payloadContent;
    private int statusCode;
    private String responseBody;

    private long responseTime;
    private long responseSize;
    private String payloadCategory;

    private String httpMethod;
    private LocalDateTime timestamp;

    private UUID scanId;
}
