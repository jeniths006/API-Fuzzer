package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.QueryParameter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QueryParameterRepository extends JpaRepository<QueryParameter, Long> {

    List<QueryParameter> findByEndpoint(Endpoint endpoint);
}
