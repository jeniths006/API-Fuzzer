package com.example.API.Fuzzer.exception;

public class QueryParameterNotFoundException extends RuntimeException{
    public QueryParameterNotFoundException(String message) {
        super(message);
    }
}
