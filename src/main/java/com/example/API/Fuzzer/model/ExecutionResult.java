package com.example.API.Fuzzer.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private Endpoint endpoint;

    private int statusCode;
    @Column(columnDefinition = "TEXT")
    private String responseBody;
    private long responseTime;
    private long responseSize;
    private boolean successful;
    private LocalDateTime executedAt;



}
