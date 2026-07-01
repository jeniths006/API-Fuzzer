package com.example.API.Fuzzer.security;


import com.example.API.Fuzzer.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import java.security.Key;

import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET = "ThisIsMyVeryLongSecretKeyForJwtSigning123!";
    private static final long EXPIRATION_TIME = 360000;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();


    }
}
