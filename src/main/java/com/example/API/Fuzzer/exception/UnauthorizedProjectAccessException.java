package com.example.API.Fuzzer.exception;

public class UnauthorizedProjectAccessException extends RuntimeException{
    public UnauthorizedProjectAccessException(String message) {
        super(message);
    }
}
