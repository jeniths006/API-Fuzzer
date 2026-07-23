package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.CreateQueryParameterRequestDTO;
import com.example.API.Fuzzer.dto.QueryParameterResponseDTO;
import com.example.API.Fuzzer.exception.QueryParameterNotFoundException;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.UnauthorizedProjectAccessException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.QueryParameter;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.QueryParameterRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QueryParameterService {

    private final QueryParameterRepository queryParameterRepository;
    private final EndpointRepository endpointRepository;
    private final AuthenticationService authenticationService;


    public QueryParameterResponseDTO createQueryParameter(Long endpointId, CreateQueryParameterRequestDTO request) {
        User user = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        QueryParameter queryParameter = new QueryParameter();
        queryParameter.setParameterName(request.getParameterName());
        queryParameter.setParameterValue(request.getParameterValue());
        queryParameter.setEndpoint(endpoint);
        queryParameter.setCreatedAt(LocalDateTime.now());
        queryParameter.setUpdatedAt(LocalDateTime.now());

        QueryParameter savedQueryParameter = queryParameterRepository.save(queryParameter);

        return mapToQueryParameterResponseDTO(savedQueryParameter);

    }

    public List<QueryParameterResponseDTO> getQueryParameters(Long endpointId) {
        User user = authenticationService.getCurrentUser();
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        if(!endpoint.getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }

        List<QueryParameter> queryParameters = queryParameterRepository.findByEndpoint(endpoint);
        return queryParameters.stream()
                .map(this::mapToQueryParameterResponseDTO)
                .collect(Collectors.toList());
    }

    public QueryParameterResponseDTO updateQueryParameter(Long queryParameterId, CreateQueryParameterRequestDTO request) {
        User user = authenticationService.getCurrentUser();
        QueryParameter queryParameter = queryParameterRepository.findById(queryParameterId)
                .orElseThrow(() -> new QueryParameterNotFoundException("Query Parameter not found"));

        if(!queryParameter.getEndpoint().getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorized to access this project");
        }


        queryParameter.setParameterName(request.getParameterName());
        queryParameter.setParameterValue(request.getParameterValue());
        queryParameter.setUpdatedAt(LocalDateTime.now());

        QueryParameter updatedQueryParameter = queryParameterRepository.save(queryParameter);

        return mapToQueryParameterResponseDTO(updatedQueryParameter);
    }

    public void deleteQueryParameter(Long queryParameterId) {
        User user = authenticationService.getCurrentUser();

        QueryParameter queryParameter = queryParameterRepository.findById(queryParameterId)
                .orElseThrow(() -> new QueryParameterNotFoundException("Query Parameter not found"));

        if(!queryParameter.getEndpoint().getProject().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("You are not authorizes to access this project");
        }

        queryParameterRepository.delete(queryParameter);
    }




    private QueryParameterResponseDTO mapToQueryParameterResponseDTO(QueryParameter QueryParameter) {
        return new QueryParameterResponseDTO(
                QueryParameter.getId(),
                QueryParameter.getParameterName(),
                QueryParameter.getParameterValue(),
                QueryParameter.getEndpoint().getId(),
                QueryParameter.getCreatedAt(),
                QueryParameter.getUpdatedAt()
        );
    }
}
