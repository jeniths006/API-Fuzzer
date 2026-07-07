package com.example.API.Fuzzer.service;


import com.example.API.Fuzzer.model.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertSame;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    private final AuthenticationService authenticationService;
    public AuthenticationServiceTest() {
        authenticationService = new AuthenticationService();
    }

    @Test
    void getCurrentUserReturnsAuthenticatedUser() {

        User user = new User();
        user.setId(1L);
        user.setUsername("jenith");
        user.setName("Jenith");
        user.setEmail("jenith@test.com");

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        User currentUser  = authenticationService.getCurrentUser();
        assertSame(user, currentUser);
    }

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    }
