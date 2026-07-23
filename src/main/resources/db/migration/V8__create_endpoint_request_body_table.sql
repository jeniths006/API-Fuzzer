CREATE TABLE endpoint_request_body (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    endpoint_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_endpoint_request_body_endpoint
       FOREIGN KEY (endpoint_id)
           REFERENCES endpoint(id)
           ON DELETE CASCADE
);