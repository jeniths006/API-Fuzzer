package com.example.API.Fuzzer.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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

    @OneToMany(mappedBy = "endpoint", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<EndpointHeader> endpointHeaderList;

    @OneToMany(mappedBy = "endpoint", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<QueryParameter> queryParameters;

    @OneToOne(mappedBy = "endpoint", cascade = CascadeType.ALL)
    @JsonIgnore
    private EndpointRequestBody endpointRequestBody;

    @OneToMany(mappedBy = "endpoint", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ExecutionResult> executionResult;
}
