package com.example.API.Fuzzer.controller;


import com.example.API.Fuzzer.dto.LoginRequestDTO;
import com.example.API.Fuzzer.dto.LoginResponseDTO;
import com.example.API.Fuzzer.dto.RegisterRequestDTO;
import com.example.API.Fuzzer.dto.UserResponseDTO;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.service.UserService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponseDTO registerUser(@RequestBody @Valid RegisterRequestDTO user) {
        return userService.registerUser(user);

    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginRequestDTO user) {
        return userService.login(user);
    }
}
