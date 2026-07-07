package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.LoginRequestDTO;
import com.example.API.Fuzzer.dto.LoginResponseDTO;
import com.example.API.Fuzzer.dto.RegisterRequestDTO;
import com.example.API.Fuzzer.dto.UserResponseDTO;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.UserRepository;
import com.example.API.Fuzzer.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

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

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

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

        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("encodedPassword");

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

    @Test
    void loginSuccessfully() {
        LoginRequestDTO request = new LoginRequestDTO(
                "jenith",
                "Password@123"
        );

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername(request.getUsername());
        savedUser.setName("jenith");
        savedUser.setEmail("jenith@test.com");
        savedUser.setPassword("$2a$12$jQ9TpjULCJR4.IAT39Mnr.EJg1PgJb1WZ8CM7yNzcqAwyvqXk1XJW");

        when(userRepository.findByUsername(request.getUsername()))
                .thenReturn(Optional.of(savedUser));

        when(passwordEncoder.matches(request.getPassword(), savedUser.getPassword()))
                .thenReturn(true);

        String token = "token";
        when(jwtUtil.generateToken(savedUser))
                .thenReturn(token);

        LoginResponseDTO response = userService.login(request);

        assertEquals(token, response.getToken());
        assertEquals("jenith", response.getUsername());

        verify(userRepository, times(1)).findByUsername(request.getUsername());
        verify(passwordEncoder, times(1)).matches(request.getPassword(), savedUser.getPassword());
        verify(jwtUtil, times(1)).generateToken(savedUser);
    }

    @Test
    void loginUserNotFound() {
        LoginRequestDTO request = new LoginRequestDTO(
                "unknownUser",
                "Password@123"
        );

        when(userRepository.findByUsername(request.getUsername()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.login(request)

        );

        assertEquals("Incorrect username or password", exception.getMessage());

        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtUtil, never()).generateToken(any());

    }

    @Test
    void loginIncorrectPassword() {
        LoginRequestDTO request = new LoginRequestDTO(
                "jenith",
                "wrongPassword"
        );

        User user = new User();
        user.setUsername("jenith");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername(request.getUsername()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.login(request)
        );

        assertEquals("Incorrect username or password", exception.getMessage());

        verify(jwtUtil, never()).generateToken(any());
    }




}