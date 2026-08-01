package com.example.API.Fuzzer.service;


import com.example.API.Fuzzer.dto.ScanSummaryDTO;
import com.example.API.Fuzzer.repository.FuzzResultRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ScanService {
    private final FuzzResultRepository repo;

    public ScanService(FuzzResultRepository fuzzResultRepository) {
        this.repo = fuzzResultRepository;
    }

    public List<ScanSummaryDTO> getScanSummaries() {
        List<Object[]> results = repo.getScanSummaries();

        return results.stream()
                .map(r -> new ScanSummaryDTO(
                        (UUID) r[0],
                        (Long) r[1],
                        (LocalDateTime) r[2],
                        (String) r[3],
                        (Long) r[4]
                ))
                .toList();
    }
}
