CREATE TABLE attack_payload (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE fuzz_result (
    id SERIAL PRIMARY KEY,
    target_url TEXT NOT NULL,
    payload_content TEXT NOT NULL,
    status_code int NOT NULL,
    response_body TEXT NOT NULL,
    response_time BIGINT NOT NULL,
    response_size BIGINT NOT NULL,
    payload_category TEXT NOT NULL,
    http_method TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    scan_id UUID NOT NULL
)

