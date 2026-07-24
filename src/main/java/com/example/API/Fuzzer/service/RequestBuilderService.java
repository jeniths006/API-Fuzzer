package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.exception.EndpointRequestBodyNotFoundException;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.EndpointHeader;
import com.example.API.Fuzzer.model.EndpointRequestBody;
import com.example.API.Fuzzer.model.QueryParameter;
import com.example.API.Fuzzer.repository.EndpointHeaderRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.repository.EndpointRequestBodyRepository;
import com.example.API.Fuzzer.repository.QueryParameterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestBuilderService {

    private final EndpointRepository endpointRepository;
    private final EndpointHeaderRepository endpointHeaderRepository;
    private final QueryParameterRepository queryParameterRepository;
    private final EndpointRequestBodyRepository endpointRequestBodyRepository;

    public BuiltRequestDTO buildRequest(Long endpointId) {
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found"));

        List<EndpointHeader> headers = endpointHeaderRepository.findByEndpoint(endpoint);
        List<QueryParameter> parameters = queryParameterRepository.findByEndpoint(endpoint);
        EndpointRequestBody requestBody = endpointRequestBodyRepository.findByEndpoint(endpoint)
                .orElse(null);

        Map<String, String> headerMap =
                headers.stream()
                        .collect(Collectors.toMap(
                                EndpointHeader::getHeaderName,
                                EndpointHeader::getHeaderValue
                        ));

        Map<String, String> parameterMap =
                parameters.stream()
                        .collect(Collectors.toMap(
                                QueryParameter::getParameterName,
                                QueryParameter::getParameterValue
                        ));


        BuiltRequestDTO builtRequestDTO = new BuiltRequestDTO(
                endpoint.getUrl(),
                endpoint.getMethod(),
                headerMap,
                parameterMap,
                requestBody != null ? requestBody.getContent() : null,
                requestBody != null ? requestBody.getContentType() : null
        );

        return  builtRequestDTO;
    }
}
