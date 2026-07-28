CREATE TABLE analysis_result (
     id BIGSERIAL PRIMARY KEY,
     execution_result_id BIGINT NOT NULL,
     vulnerability_type VARCHAR(255),
     severity VARCHAR(50),
     confidence INT,
     detected BOOLEAN,
     evidence TEXT,

     CONSTRAINT fk_analysis_execution
         FOREIGN KEY (execution_result_id)
             REFERENCES execution_result(id)
             ON DELETE CASCADE
);