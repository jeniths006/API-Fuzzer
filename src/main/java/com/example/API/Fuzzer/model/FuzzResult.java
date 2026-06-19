package com.example.API.Fuzzer.model;

import jakarta.persistence.*;
import lombok.*;

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
    @Column(columnDefinition = "TEXT")
    private String responseBody;
}
