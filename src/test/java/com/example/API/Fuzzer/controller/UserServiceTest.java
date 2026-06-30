package com.example.API.Fuzzer.controller;

import com.example.API.Fuzzer.dto.RegisterRequestDTO;
import com.example.API.Fuzzer.dto.UserResponseDTO;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void registerUserSuccessfully() {

        RegisterRequestDTO request = new RegisterRequestDTO(
                "jenith",
                "Jenith",
                "jenith@test.com",
                "password123"
        );

        when(userRepository.findByUsername(request.getUsername()))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.empty());

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername(request.getUsername());
        savedUser.setName(request.getName());
        savedUser.setEmail(request.getEmail());
        savedUser.setPassword(request.getPassword());

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        UserResponseDTO response = userService.registerUser(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("jenith", response.getUsername());
        assertEquals("Jenith", response.getName());
        assertEquals("jenith@test.com", response.getEmail());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUserUsernameAlreadyExists() {

        RegisterRequestDTO request = new RegisterRequestDTO(
                "jenith",
                "Jenith",
                "jenith@test.com",
                "password123"
        );

        User existingUser = new User();
        existingUser.setUsername("jenith");

        when(userRepository.findByUsername(request.getUsername()))
                .thenReturn(Optional.of(existingUser));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.registerUser(request)
        );

        assertEquals("Username already exists", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUserEmailAlreadyExists() {

        RegisterRequestDTO request = new RegisterRequestDTO(
                "jenith",
                "Jenith",
                "jenith@test.com",
                "password123"
        );

        User existingUser = new User();
        existingUser.setEmail("jenith@test.com");

        when(userRepository.findByUsername(request.getUsername()))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(existingUser));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.registerUser(request)
        );

        assertEquals("Email already exists", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }
}