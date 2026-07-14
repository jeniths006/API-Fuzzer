package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findById(Long id);
}
