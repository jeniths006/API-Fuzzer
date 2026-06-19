package com.example.API.Fuzzer.repository;

import com.example.API.Fuzzer.model.AttackPayload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttackPayloadRepository extends JpaRepository<AttackPayload, Long> {

}
