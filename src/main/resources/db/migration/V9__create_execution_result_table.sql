CREATE TABLE execution_result (
    id BIGSERIAL PRIMARY KEY,

    endpoint_id BIGINT NOT NULL,

    status_code INTEGER NOT NULL,

    response_body TEXT,

    response_time BIGINT NOT NULL,

    response_size BIGINT NOT NULL,

    successful BOOLEAN NOT NULL,

    executed_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_execution_result_endpoint
      FOREIGN KEY (endpoint_id)
          REFERENCES endpoint(id)
          ON DELETE CASCADE
);