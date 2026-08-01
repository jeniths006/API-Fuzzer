package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.Project;
import com.example.API.Fuzzer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findById(Long id);

    List<Project> findByOwner(User owner);
}
