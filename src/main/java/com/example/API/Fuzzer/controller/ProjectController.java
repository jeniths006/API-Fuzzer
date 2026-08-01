package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.CreateProjectRequestDTO;
import com.example.API.Fuzzer.dto.ProjectResponseDTO;
import com.example.API.Fuzzer.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ProjectResponseDTO createProject(@RequestBody CreateProjectRequestDTO request) {
        return projectService.createProject(request);
    }

    @GetMapping
    public List<ProjectResponseDTO> getProjects() {
        return projectService.getProjects();
    }

    @DeleteMapping("/{projectId}")
    public void deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
    }

}
