package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.FuzzResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Repository
public interface FuzzResultRepository extends JpaRepository<FuzzResult, Long> {

    public List<FuzzResult> findByscanId(UUID scanId);

    @Query("SELECT f.scanId, COUNT(f) FROM FuzzResult f GROUP BY f.scanId ORDER BY MAX(f.timestamp) DESC")
    List<Object[]> getScanSummaries();
}
