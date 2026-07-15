package com.example.API.Fuzzer.service;



import com.example.API.Fuzzer.dto.CreateEndpointRequestDTO;
import com.example.API.Fuzzer.dto.EndpointResponseDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EndpointService {

    private final EndpointRepository endpointRepository;
    private final AuthenticationService authenticationService;
    private final ProjectRepository projectRepository;
    public EndpointResponseDTO createEndpoint(Long projectId, CreateEndpointRequestDTO request) {
        User currentUser = authenticationService.getCurrentUser();

        LocalDateTime now = LocalDateTime.now();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        if(!project.getOwner().getId().equals(currentUser.getId())) {
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

        return mapToEndpointResponseDTO(savedEndpoint);

    }
    
    public List<EndpointResponseDTO> getEndpoints(Long projectId) {
        User currentUser = authenticationService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));
        if(!project.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }
        List<Endpoint> endpoints = endpointRepository.findByProject(project);
        return endpoints.stream()
                .map(this::mapToEndpointResponseDTO)
                .collect(Collectors.toList());
    }

    public EndpointResponseDTO getEndpoint(long endpointId) {
        User currentUser = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        EndpointResponseDTO response = mapToEndpointResponseDTO(endpoint);
        return response;
    }

    public EndpointResponseDTO updateEndpoint(Long endpointId, CreateEndpointRequestDTO request) {
        User currentUser = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        endpoint.setName(request.getName());
        endpoint.setMethod(request.getMethod());
        endpoint.setUrl(request.getUrl());
        endpoint.setUpdatedAt(LocalDateTime.now());

        Endpoint updatedEndpoint = endpointRepository.save(endpoint);

        return mapToEndpointResponseDTO(updatedEndpoint);
    }

    public void deleteEndpoint(Long endpointId) {
        User currentUser = authenticationService.getCurrentUser();

        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }



        endpointRepository.delete(endpoint);
    }

    private EndpointResponseDTO mapToEndpointResponseDTO(Endpoint endpoint) {
        return new EndpointResponseDTO(
                endpoint.getId(),
                endpoint.getName(),
                endpoint.getMethod(),
                endpoint.getUrl(),
                endpoint.getProject().getId(),
                endpoint.getCreatedAt(),
                endpoint.getUpdatedAt()
        );
    }
}