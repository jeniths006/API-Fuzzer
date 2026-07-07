package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EndpointRepository extends JpaRepository<Endpoint, Long> {

    List<Endpoint> findByProject(Project project);
}
