CREATE TABLE endpoint_header (
    id BIGSERIAL PRIMARY KEY,
    header_name VARCHAR(255) NOT NULL,
    header_value TEXT NOT NULL,
    endpoint_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_endpoint_header_endpoint
                      FOREIGN KEY (endpoint_id)
                      REFERENCES endpoint(id)
                      ON DELETE CASCADE
 );