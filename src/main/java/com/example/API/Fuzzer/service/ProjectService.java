package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateProjectRequestDTO;
import com.example.API.Fuzzer.dto.ProjectResponseDTO;
import com.example.API.Fuzzer.exception.ProjectNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.Project;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public List<ProjectResponseDTO> getProjects() {

        User currentUser = authenticationService.getCurrentUser();

        return projectRepository.findByOwner(currentUser).stream()
                .map(project -> new ProjectResponseDTO(
                        project.getId(),
                        project.getName(),
                        project.getDescription(),
                        project.getOwner().getUsername(),
                        project.getCreatedAt(),
                        project.getUpdatedAt()
                ))
                .toList();
    }

    public void deleteProject(Long projectId) {

        User currentUser = authenticationService.getCurrentUser();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedProjectAccessException("You do not own this project");
        }

        projectRepository.delete(project);
    }
}
