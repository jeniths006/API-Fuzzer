package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateEndpointRequestBodyRequestDTO;
import com.example.API.Fuzzer.dto.EndpointRequestBodyResponseDTO;
import com.example.API.Fuzzer.exception.EndpointRequestBodyNotFoundException;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.EndpointRequestBody;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.EndpointRequestBodyRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EndpointRequestBodyService {

    private final EndpointRequestBodyRepository endpointRequestBodyRepository;
    private final EndpointRepository endpointRepository;
    private final AuthenticationService authenticationService;


    public EndpointRequestBodyResponseDTO createRequestBody(Long endpointId, CreateEndpointRequestBodyRequestDTO request) {
        User user = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        if(endpointRequestBodyRepository.findByEndpoint(endpoint).isPresent()) {
            throw new IllegalStateException("Request body already exists for this endpoint");
        }

        EndpointRequestBody endpointRequestBody = new EndpointRequestBody();
        endpointRequestBody.setContent(request.getContent());
        endpointRequestBody.setContentType(request.getContentType());
        endpointRequestBody.setEndpoint(endpoint);
        endpointRequestBody.setCreatedAt(LocalDateTime.now());
        endpointRequestBody.setUpdatedAt(LocalDateTime.now());


        EndpointRequestBody savedEndpointRequestBody = endpointRequestBodyRepository.save(endpointRequestBody);

        return mapToRequestBodyResponseDTO(savedEndpointRequestBody);

    }

    public EndpointRequestBodyResponseDTO getRequestBody(Long endpointId) {
        User user = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        EndpointRequestBody endpointRequestBody = endpointRequestBodyRepository.findByEndpoint(endpoint)
                .orElseThrow(() -> new EndpointRequestBodyNotFoundException("Request Body not found"));

        return mapToRequestBodyResponseDTO(endpointRequestBody);
    }

    public EndpointRequestBodyResponseDTO updateRequestBody(Long RequestBodyId, CreateEndpointRequestBodyRequestDTO request) {
        User user = authenticationService.getCurrentUser();
        EndpointRequestBody endpointRequestBody = endpointRequestBodyRepository.findById(RequestBodyId)
                .orElseThrow(() -> new EndpointRequestBodyNotFoundException("Request Body not found"));

        if(!endpointRequestBody.getEndpoint().getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        endpointRequestBody.setContent(request.getContent());
        endpointRequestBody.setContentType(request.getContentType());
        endpointRequestBody.setUpdatedAt(LocalDateTime.now());

        EndpointRequestBody updatedEndpointRequestBody = endpointRequestBodyRepository.save(endpointRequestBody);

        return mapToRequestBodyResponseDTO(updatedEndpointRequestBody);
    }

    public void deleteRequestBody(Long requestBodyId) {
        User user = authenticationService.getCurrentUser();

        EndpointRequestBody endpointRequestBody = endpointRequestBodyRepository.findById(requestBodyId)
                .orElseThrow(() -> new EndpointRequestBodyNotFoundException("Request Body not found"));

        if(!endpointRequestBody.getEndpoint().getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorizes to access this project");
        }

        endpointRequestBodyRepository.delete(endpointRequestBody);
    }




    private EndpointRequestBodyResponseDTO mapToRequestBodyResponseDTO(EndpointRequestBody endpointRequestBody) {
        return new EndpointRequestBodyResponseDTO(
                endpointRequestBody.getId(),
                endpointRequestBody.getContent(),
                endpointRequestBody.getContentType(),
                endpointRequestBody.getEndpoint().getId(),
                endpointRequestBody.getCreatedAt(),
                endpointRequestBody.getUpdatedAt()
        );
    }
}
