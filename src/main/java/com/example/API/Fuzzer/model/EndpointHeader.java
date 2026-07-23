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
@NoArgsConstructor
@AllArgsConstructor
public class EndpointHeader {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String headerName;
    private String headerValue;
    @ManyToOne
    @JoinColumn(name = "endpoint_id")
    private Endpoint endpoint;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
