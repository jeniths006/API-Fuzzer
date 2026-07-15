package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.EndpointHeader;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EndpointHeaderRepository extends JpaRepository<EndpointHeader, Long> {
    List<EndpointHeader> findByEndpoint(Endpoint endpoint);


}
