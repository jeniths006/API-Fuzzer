CREATE TABLE query_parameter (
     id BIGSERIAL PRIMARY KEY,
     parameter_name VARCHAR(255) NOT NULL,
     parameter_value TEXT NOT NULL,
     endpoint_id BIGINT NOT NULL,
     created_at TIMESTAMP NOT NULL,
     updated_at TIMESTAMP NOT NULL,

     CONSTRAINT fk_endpoint_header_endpoint
         FOREIGN KEY (endpoint_id)
             REFERENCES endpoint(id)
             ON DELETE CASCADE
);