package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateProjectRequestDTO;
import com.example.API.Fuzzer.dto.ProjectResponseDTO;
import com.example.API.Fuzzer.model.Project;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final AuthenticationService authenticationService;

    public ProjectResponseDTO createProject(CreateProjectRequestDTO request) {
        User currentUser = authenticationService.getCurrentUser();
        Project project = new Project();

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(currentUser);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());


        Project savedProject = projectRepository.save(project);

        return new ProjectResponseDTO(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription(),
                savedProject.getOwner().getUsername(),
                savedProject.getCreatedAt(),
                savedProject.getUpdatedAt()
        );

    }
}
