package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
