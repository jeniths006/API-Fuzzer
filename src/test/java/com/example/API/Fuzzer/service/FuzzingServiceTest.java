package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.BuiltRequestDTO;
import com.example.API.Fuzzer.dto.FuzzRequestDTO;
import com.example.API.Fuzzer.exception.EndpointNotFoundException;
import com.example.API.Fuzzer.model.AttackPayload;
import com.example.API.Fuzzer.model.Endpoint;
import com.example.API.Fuzzer.model.HttpMethod;
import com.example.API.Fuzzer.repository.AttackPayloadRepository;
import com.example.API.Fuzzer.repository.EndpointRepository;
import com.example.API.Fuzzer.util.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FuzzingServiceTest {

    @Mock
    private AttackPayloadRepository attackPayloadRepository;

    @Mock
    private RequestExecutionService requestExecutionService;

    @Mock
    private EndpointRepository endpointRepository;

    @Mock
    private RequestBuilderService requestBuilderService;

    @InjectMocks
    private FuzzingService fuzzingService;

    private Endpoint endpoint;
    private FuzzRequestDTO fuzzRequestDTO;
    private AttackPayload payload1;
    private AttackPayload payload2;
    private BuiltRequestDTO builtRequestDTO;

    @BeforeEach
    void setUp() {
        endpoint = new Endpoint();
        endpoint.setId(10L);

        fuzzRequestDTO = new FuzzRequestDTO();
        fuzzRequestDTO.setCategories(List.of("SQLi", "XSS"));

        payload1 = new AttackPayload();
        payload1.setId(1L);
        payload1.setContent("' OR '1'='1");

        payload2 = new AttackPayload();
        payload2.setId(2L);
        payload2.setContent("<script>alert(1)</script>");

        builtRequestDTO = new BuiltRequestDTO(
                10L,
                "https://api.example.com/test",
                HttpMethod.POST,
                Map.of(),
                Map.of(),
                "original body",
                ContentType.JSON
        );
    }

    @Test
    void runScan_Success() {
        when(attackPayloadRepository.findByCategoryIn(fuzzRequestDTO.getCategories()))
                .thenReturn(List.of(payload1, payload2));
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));
        when(requestBuilderService.buildRequest(10L)).thenReturn(builtRequestDTO);

        fuzzingService.runScan(10L, fuzzRequestDTO);

        verify(attackPayloadRepository, times(1)).findByCategoryIn(fuzzRequestDTO.getCategories());
        verify(endpointRepository, times(1)).findById(10L);

        // Should build and execute twice, once for each payload, injecting the payload content into the body
        verify(requestBuilderService, times(2)).buildRequest(10L);
        verify(requestExecutionService, times(2)).execute(eq(endpoint), any(BuiltRequestDTO.class));
    }

    @Test
    void runScan_EndpointNotFound() {
        when(attackPayloadRepository.findByCategoryIn(fuzzRequestDTO.getCategories()))
                .thenReturn(List.of(payload1));
        when(endpointRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(EndpointNotFoundException.class, () -> fuzzingService.runScan(10L, fuzzRequestDTO));

        verify(attackPayloadRepository, times(1)).findByCategoryIn(fuzzRequestDTO.getCategories());
        verify(endpointRepository, times(1)).findById(10L);
        verifyNoInteractions(requestBuilderService);
        verifyNoInteractions(requestExecutionService);
    }

    @Test
    void runScan_EmptyPayloadsList() {
        when(attackPayloadRepository.findByCategoryIn(fuzzRequestDTO.getCategories()))
                .thenReturn(List.of());
        when(endpointRepository.findById(10L)).thenReturn(Optional.of(endpoint));

        fuzzingService.runScan(10L, fuzzRequestDTO);

        verify(attackPayloadRepository, times(1)).findByCategoryIn(fuzzRequestDTO.getCategories());
        verify(endpointRepository, times(1)).findById(10L);
        verifyNoInteractions(requestBuilderService);
        verifyNoInteractions(requestExecutionService);
    }
}