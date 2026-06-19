# API Fuzzer

API Fuzzer is an early-stage Spring Boot project for testing how APIs respond to security-focused payloads. It stores reusable attack payloads, sends selected payloads to a target endpoint, and records the HTTP response data for later review.

The goal is to grow this into a larger API security testing tool for controlled environments, such as personal projects, lab targets, and APIs where testing is explicitly authorized.

## Current Features

- Store attack payloads with a name, content, and category.
- List, add, and delete saved payloads.
- Send a saved payload to a target URL using an HTTP POST request.
- Persist fuzzing results, including target URL, payload content, status code, and response body.
- Use PostgreSQL for persistence through Spring Data JPA.

## Tech Stack

- Java 21
- Spring Boot
- Spring Web MVC
- Spring WebFlux `WebClient`
- Spring Data JPA
- PostgreSQL
- Gradle
- Docker Compose

## Getting Started

### Prerequisites

- Java 21
- Docker Desktop, for the PostgreSQL database
- Git

### Start PostgreSQL

```powershell
docker compose up -d
```

The app expects PostgreSQL to be available at:

```text
jdbc:postgresql://localhost:5432/fuzzerdb
```

Default local credentials are configured in `src/main/resources/application.properties`:

```text
username: user
password: password
database: fuzzerdb
```

### Run the Application

```powershell
.\gradlew.bat bootRun
```

By default, the API runs on:

```text
http://localhost:8080
```

### Run Tests

```powershell
.\gradlew.bat test
```

## API Endpoints

### List Payloads

```http
GET /api/payloads
```

### Add Payload

```http
POST /api/payloads
Content-Type: application/json

{
  "name": "Basic SQL Injection",
  "content": "' OR '1'='1",
  "category": "sql-injection"
}
```

### Delete Payload

```http
DELETE /api/payloads/{id}
```

### Fuzz a Target URL

```http
POST /api/payloads/fuzz/{id}?targetUrl=http://localhost:3000/test
```

This sends the selected payload as the POST body to the supplied `targetUrl`.

### List Fuzzing Results

```http
GET /api/payloads/results
```

## Roadmap

- Add request method, headers, and body format configuration.
- Add payload categories and seed payload libraries.
- Add response analysis for common security signals.
- Add timeout, retry, and error handling for failed requests.
- Add authentication support for testing protected APIs.
- Add a UI for managing payloads and reviewing results.
- Add report export for fuzzing sessions.

## Responsible Use

Only run this tool against APIs you own or have explicit permission to test. API fuzzing can cause unexpected load, trigger security alerts, corrupt test data, or expose vulnerabilities. Keep testing scoped, logged, and isolated from production systems unless authorization and safeguards are in place.
