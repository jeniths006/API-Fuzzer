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
public class Endpoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private HttpMethod method;
    private String url;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
