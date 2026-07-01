package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.RegisterRequestDTO;
import com.example.API.Fuzzer.dto.UserResponseDTO;
import com.example.API.Fuzzer.exception.EmailAlreadyExistsException;
import com.example.API.Fuzzer.exception.UsernameAlreadyExistsException;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    private PasswordEncoder passwordEncoder;



    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO registerUser(RegisterRequestDTO user) {
        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));


        User savedUser = userRepository.save(newUser);

        UserResponseDTO response = new UserResponseDTO(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getEmail()
        );
        return response;
    }

}
