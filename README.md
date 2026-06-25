# API Fuzzer

A modern web-based API security testing platform designed to automate fuzzing, payload injection, response analysis, and vulnerability discovery across REST APIs.

## Overview

API Fuzzer helps security researchers, developers, and penetration testers identify potential vulnerabilities in web APIs by automatically injecting malicious payloads and analysing responses for unusual behaviour.

The platform supports large-scale automated testing while providing a clean dashboard for scan management and result analysis.

---

## Features

### Automated API Fuzzing

* Send payloads against any HTTP endpoint
* Support for GET, POST, PUT, PATCH and DELETE requests
* Configurable target URLs
* Automated payload execution

### Payload Management

* Persistent payload storage
* Categorised payload libraries
* Custom payload creation
* Seeded vulnerability payload database

Supported categories include:

* SQL Injection
* Cross-Site Scripting (XSS)
* Command Injection
* Path Traversal
* SSRF
* Custom Payloads

### Scan Management

* Unique scan IDs for every fuzzing session
* Scan grouping and tracking
* Historical scan retrieval
* Scan-specific result filtering

### Response Analysis

The platform records:

* HTTP Status Codes
* Response Times
* Response Sizes
* Response Bodies
* Request Methods
* Payload Categories
* Target Endpoints

### Result Dashboard

* Real-time result monitoring
* Historical result browsing
* Scan-specific views
* Detailed response inspection

### Data Persistence

All scans, payloads and results are stored in PostgreSQL for long-term analysis and reporting.

---

## Technology Stack

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Flyway
* PostgreSQL

### Frontend

* React
* React Router
* Axios
* Tailwind CSS
* Vite

### Database

* PostgreSQL

### Build Tools

* Gradle
* npm

---

## Architecture

Frontend (React)

↓

REST API

↓

Spring Boot Backend

↓

PostgreSQL Database

---

## Database Schema

### attack_payload

Stores reusable attack payloads.

| Field    | Type   |
| -------- | ------ |
| id       | SERIAL |
| name     | TEXT   |
| content  | TEXT   |
| category | TEXT   |

### fuzz_result

Stores results generated during scans.

| Field           | Type      |
| --------------- | --------- |
| id              | SERIAL    |
| targetUrl       | TEXT      |
| payloadContent  | TEXT      |
| statusCode      | INTEGER   |
| responseBody    | TEXT      |
| responseTime    | BIGINT    |
| responseSize    | BIGINT    |
| payloadCategory | TEXT      |
| httpMethod      | TEXT      |
| timestamp       | TIMESTAMP |
| scanId          | UUID      |

---

## Security Use Cases

API Fuzzer can be used to test for:

* SQL Injection
* Cross-Site Scripting
* Command Injection
* Path Traversal
* Server-Side Request Forgery
* Error Disclosure
* Input Validation Issues
* Unexpected Response Behaviour

---

## Future Enhancements

* Authentication support
* JWT handling
* OpenAPI/Swagger import
* Multi-threaded scanning
* Automated vulnerability detection
* Report generation
* Scan scheduling
* Role-based access control
* Docker deployment
* Kubernetes support

---

## Getting Started

### Backend

```bash
git clone https://github.com/yourusername/API-Fuzzer.git

cd API-Fuzzer

./gradlew bootRun
```

### Frontend

```bash
cd fuzzer-ui

npm install

npm run dev
```

### Database

Configure PostgreSQL connection details in:

```properties
application.properties
```

Flyway migrations will automatically initialise the database.

---

## Disclaimer

This project is intended for educational, research and authorised security testing purposes only.

Only test systems you own or have explicit permission to assess.

```
```
