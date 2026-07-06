package com.example.API.Fuzzer.service;


import com.example.API.Fuzzer.dto.CreateProjectRequestDTO;
import com.example.API.Fuzzer.dto.ProjectResponseDTO;
import com.example.API.Fuzzer.model.Project;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void createProjectSuccessfully() {
        CreateProjectRequestDTO request = new CreateProjectRequestDTO(
                "DVWA",
                "Web Application Security Testing"
        );

        User user = new User();
        user.setId(1L);
        user.setUsername("jenith");
        user.setName("Jenith");
        user.setEmail("jenith@test.com");

        when(authenticationService.getCurrentUser())
                .thenReturn(user);

        when(projectRepository.save(any(Project.class)))
                .thenAnswer(invocation -> {
                    Project project = invocation.getArgument(0);
                    project.setId(1L);
                    return project;
                });

        ProjectResponseDTO response = projectService.createProject(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("DVWA", response.getName());
        assertEquals("Web Application Security Testing", response.getDescription());
        assertEquals("jenith", response.getOwnerUsername());
        assertNotNull(response.getCreatedAt());
        assertNotNull(response.getUpdatedAt());

        verify(authenticationService)
                .getCurrentUser();

        verify(projectRepository)
                .save(any(Project.class));

    }
}
