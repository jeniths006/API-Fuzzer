package com.example.API.Fuzzer.exception;

public class EndpointNotFoundException extends RuntimeException{
    public EndpointNotFoundException(String message) {
        super(message);
    }
}
