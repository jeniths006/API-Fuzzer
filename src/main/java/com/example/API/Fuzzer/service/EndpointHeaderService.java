package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateEndpointHeaderRequestDTO;
import com.example.API.Fuzzer.dto.EndpointHeaderResponseDTO;
import com.example.API.Fuzzer.exception.EndpointHeaderNotFoundException;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.EndpointHeader;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.EndpointHeaderRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EndpointHeaderService {

    private final EndpointHeaderRepository endpointHeaderRepository;
    private final EndpointRepository endpointRepository;
    private final AuthenticationService authenticationService;


    public EndpointHeaderResponseDTO createHeader(Long endpointId, CreateEndpointHeaderRequestDTO request) {
        User user = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        EndpointHeader endpointHeader = new EndpointHeader();
        endpointHeader.setHeaderName(request.getHeaderName());
        endpointHeader.setHeaderValue(request.getHeaderValue());
        endpointHeader.setEndpoint(endpoint);
        endpointHeader.setCreatedAt(LocalDateTime.now());
        endpointHeader.setUpdatedAt(LocalDateTime.now());

        EndpointHeader savedEndpointHeader = endpointHeaderRepository.save(endpointHeader);

        return mapToEndpointHeaderResponseDTO(savedEndpointHeader);

    }

    public List<EndpointHeaderResponseDTO> getHeaders(Long endpointId) {
        User user = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        List<EndpointHeader> endpointHeaders = endpointHeaderRepository.findByEndpoint(endpoint);
        return endpointHeaders.stream()
                .map(this::mapToEndpointHeaderResponseDTO)
                .collect(Collectors.toList());
    }

    public EndpointHeaderResponseDTO updateHeader(Long headerId, CreateEndpointHeaderRequestDTO request) {
        User user = authenticationService.getCurrentUser();
        EndpointHeader endpointHeader = endpointHeaderRepository.findById(headerId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpointHeader.getEndpoint().getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }


        endpointHeader.setHeaderName(request.getHeaderName());
        endpointHeader.setHeaderValue(request.getHeaderValue());
        endpointHeader.setUpdatedAt(LocalDateTime.now());

        EndpointHeader updatedEndpointHeader = endpointHeaderRepository.save(endpointHeader);

        return mapToEndpointHeaderResponseDTO(updatedEndpointHeader);
    }

    public void deleteHeader(Long headerId) {
        User user = authenticationService.getCurrentUser();

        EndpointHeader endpointHeader = endpointHeaderRepository.findById(headerId)
                .orElseThrow(() -> new EndpointHeaderNotFoundException("Endpoint Header not found"));

        if(!endpointHeader.getEndpoint().getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorizes to access this project");
        }

        endpointHeaderRepository.delete(endpointHeader);
    }




    private EndpointHeaderResponseDTO mapToEndpointHeaderResponseDTO(EndpointHeader endpointHeader) {
        return new EndpointHeaderResponseDTO(
                endpointHeader.getId(),
                endpointHeader.getHeaderName(),
                endpointHeader.getHeaderValue(),
                endpointHeader.getEndpoint().getId(),
                endpointHeader.getCreatedAt(),
                endpointHeader.getUpdatedAt()
        );
    }
}
