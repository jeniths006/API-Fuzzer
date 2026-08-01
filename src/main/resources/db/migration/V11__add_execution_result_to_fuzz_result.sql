ALTER TABLE fuzz_result 
ADD COLUMN execution_result_id BIGINT,
ADD CONSTRAINT fk_fuzz_result_execution_result 
FOREIGN KEY (execution_result_id) REFERENCES execution_result(id);
