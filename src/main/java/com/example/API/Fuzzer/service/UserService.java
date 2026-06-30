package com.example.API.Fuzzer.service;

import com.example.API.Fuzzer.dto.RegisterRequestDTO;
import com.example.API.Fuzzer.dto.UserResponseDTO;
import com.example.API.Fuzzer.model.User;
import com.example.API.Fuzzer.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponseDTO registerUser(RegisterRequestDTO user) {
        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());


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
