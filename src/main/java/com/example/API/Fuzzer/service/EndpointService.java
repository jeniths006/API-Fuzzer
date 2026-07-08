package com.example.API.Fuzzer.service;



import com.example.API.Fuzzer.dto.CreateEndpointRequestDTO;
import com.example.API.Fuzzer.dto.EndpointResponseDTO;
import com.example.API.Fuzzer.exception.ProjectNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.Project;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EndpointService {

    private final EndpointRepository endpointRepository;
    private final ProjectService projectService;
    private final AuthenticationService authenticationService;
    private final ProjectRepository projectRepository;

    public EndpointResponseDTO createEndpoint(Long projectId, CreateEndpointRequestDTO request) {
        User currentUser = authenticationService.getCurrentUser();

        LocalDateTime now = LocalDateTime.now();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        if(project.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        Endpoint endpoint = new Endpoint();
        endpoint.setName(request.getName());
        endpoint.setMethod(request.getMethod());
        endpoint.setUrl(request.getUrl());
        endpoint.setProject(project);
        endpoint.setCreatedAt(now);
        endpoint.setUpdatedAt(now);

        Endpoint savedEndpoint = endpointRepository.save(endpoint);

        EndpointResponseDTO response = new EndpointResponseDTO();
        response.setId(savedEndpoint.getId());
        response.setName(savedEndpoint.getName());
        response.setHttpMethod(savedEndpoint.getMethod());
        response.setUrl(savedEndpoint.getUrl());
        response.setProjectId(savedEndpoint.getId());
        response.setCreatedAt(now);
        response.setUpdatedAt(now);

        return response;

    }
}
