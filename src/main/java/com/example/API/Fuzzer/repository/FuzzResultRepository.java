package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.FuzzResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FuzzResultRepository extends JpaRepository<FuzzResult, Long> {

    public List<FuzzResult> findByscanId(UUID scanId);
}
