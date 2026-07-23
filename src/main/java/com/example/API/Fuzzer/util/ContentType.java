package com.example.API.Fuzzer.util;

public enum ContentType {
    JSON("application/json"),
    XML("application/xml"),
    TEXT_XML("text/xml"),
    YAML("application/x-yaml"),
    TEXT_YAML("text/yaml"),


    FORM_URLENCODED("application/x-www-form-urlencoded"),
    MULTIPART_FORM("multipart/form-data"),

    TEXT_PLAIN("text/plain"),
    TEXT_CSV("text/csv"),
    HTML("text/html"),

    MALFORMED_JSON("application/json; charset=utf-16"),
    MIXED_TYPES("application/json, application/xml"),
    INVALID_CUSTOM("application/fuzz-invalid"),
    EMPTY("");

    private final String value;

    ContentType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}