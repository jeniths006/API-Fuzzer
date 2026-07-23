package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.EndpointRequestBody;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EndpointRequestBodyRepository extends JpaRepository<EndpointRequestBody, Long> {

    Optional<EndpointRequestBody> findByEndpoint(Endpoint endpoint);
}
