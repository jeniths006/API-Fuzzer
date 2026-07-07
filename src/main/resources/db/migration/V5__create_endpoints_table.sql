CREATE TABLE endpoint (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    method VARCHAR(20) NOT NULL,
    url VARCHAR(500) NOT NULL,
    project_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_endpoint_project
                      FOREIGN KEY (project_id)
                      REFERENCES projects(id)
                      ON DELETE CASCADE
);