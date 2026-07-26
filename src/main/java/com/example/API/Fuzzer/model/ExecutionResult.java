package com.example.API.Fuzzer.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExecutionResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Endpoint endpoint;

    private int statusCode;
    private String responseBody;
    private long responseTime;
    private long responseSize;
    private boolean successful;
    private LocalDateTime executedAt;



}
