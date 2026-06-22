package com.example.API.Fuzzer.controller;


import com.example.API.Fuzzer.dto.ScanSummaryDTO;
import com.example.API.Fuzzer.service.ScanService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/")
public class ScanController {

    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @GetMapping("/scans")
    public List<ScanSummaryDTO> getScans() {
        return scanService.getScanSummaries();
    }
}
