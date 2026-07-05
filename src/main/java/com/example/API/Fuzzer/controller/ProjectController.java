package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateProjectRequestDTO;
import com.example.API.Fuzzer.dto.ProjectResponseDTO;
import com.example.API.Fuzzer.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ProjectResponseDTO createProject(@RequestBody CreateProjectRequestDTO request) {
        return projectService.createProject(request);
    }

}
