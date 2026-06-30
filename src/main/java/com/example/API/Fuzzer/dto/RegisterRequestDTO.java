package com.example.API.Fuzzer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    @NotBlank(message = "Username cannot be blank") @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;
    @NotBlank(message = "Name cannot be blank")
    private String name;
    @Email(message = "Please enter a valid email address")
    private String email;
    @NotBlank(message = "Password cannot be blank") @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
}
