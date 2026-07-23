package com.example.API.Fuzzer.model;

import com.example.API.Fuzzer.util.ContentType;
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
public class EndpointRequestBody {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    @OneToOne
    @JoinColumn(name = "endpoint_id")
    private Endpoint endpoint;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
