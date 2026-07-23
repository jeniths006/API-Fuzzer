package com.example.API.Fuzzer.exception;

public class EndpointHeaderNotFoundException extends RuntimeException{
    public EndpointHeaderNotFoundException(String message) {
        super(message);
    }
}
