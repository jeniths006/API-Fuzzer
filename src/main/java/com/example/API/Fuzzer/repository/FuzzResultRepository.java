package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.FuzzResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FuzzResultRepository extends JpaRepository<FuzzResult, Long> {
}
