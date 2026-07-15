# API Fuzzer

> A full-stack API security testing platform for automated fuzzing, payload injection, endpoint management, and vulnerability discovery.

API Fuzzer is an open-source web application designed to help developers, security engineers, and penetration testers identify vulnerabilities in REST APIs through automated fuzz testing.

The platform provides an end-to-end workflow for managing API projects, configuring endpoints, executing fuzzing campaigns, and analysing responses through a modern web interface.

---

## Features

### Authentication

* JWT-based authentication
* User registration and login
* Secure password hashing using BCrypt
* Protected REST API endpoints

### Project Management

* Create, update and delete projects
* Organise multiple API testing targets
* Ownership-based authorization
* User-specific project isolation

### Endpoint Management

* Create, update and delete API endpoints
* Associate endpoints with projects
* Support for:

    * GET
    * POST
    * PUT
    * PATCH
    * DELETE
* Authorization checks
* Fully unit tested service and controller layers

### Payload Management

* Persistent payload storage
* Payload categorisation
* Custom payload creation
* Built-in payload library

Supported payload categories include:

* SQL Injection
* Cross-Site Scripting (XSS)
* Command Injection
* Path Traversal
* Server-Side Request Forgery (SSRF)
* Custom Payloads

### Automated Fuzzing

* Execute payloads against REST APIs
* Configurable target endpoints
* Support for multiple HTTP methods
* Scan identification using UUIDs

### Response Analysis

Every request records:

* HTTP Status Code
* Response Time
* Response Size
* Response Body
* Target Endpoint
* HTTP Method
* Payload Used
* Payload Category
* Scan ID
* Timestamp

### Result Persistence

All payloads, scan results, projects and endpoints are stored in PostgreSQL for long-term analysis and reporting.

---

## Technology Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* Flyway
* PostgreSQL
* Gradle

### Frontend

* React
* React Router
* Axios
* Tailwind CSS
* Vite

### Database

* PostgreSQL

---

## Architecture

```text
                React Frontend
                       │
                       ▼
                 REST Controllers
                       │
                       ▼
                Spring Boot Services
                       │
                       ▼
                  JPA Repositories
                       │
                       ▼
                 PostgreSQL Database
```

---

## Current Database Model

```text
User
 └── Project
      └── Endpoint

AttackPayload

FuzzResult
```

---

## Project Status

### Completed

* ✅ JWT Authentication
* ✅ Project Management
* ✅ Endpoint Management
* ✅ Payload Management
* ✅ Automated Fuzzing Engine
* ✅ Scan Result Persistence
* ✅ Response Analysis

### Currently In Progress

* 🚧 Request Builder
* 🚧 Endpoint Headers
* 🚧 Query Parameter Management

### Planned Features

* Authentication Profiles
* Request Templates
* Swagger/OpenAPI Import
* Postman Collection Import
* Automated Vulnerability Detection
* Multi-threaded Scanning
* Scan Scheduling
* Report Generation (PDF/HTML)
* Docker Deployment
* Kubernetes Support

---

## Supported Vulnerability Testing

API Fuzzer is designed to assist with testing for:

* SQL Injection
* Cross-Site Scripting (XSS)
* Command Injection
* Path Traversal
* Server-Side Request Forgery (SSRF)
* Input Validation Issues
* Error Disclosure
* Unexpected API Behaviour

---

## Running Locally

### Clone the Repository

```bash
git clone https://github.com/jeniths006/API-Fuzzer.git

cd API-Fuzzer
```

### Backend

```bash
./gradlew bootRun
```

### Frontend

```bash
cd fuzzer-ui

npm install

npm run dev
```

### Database

Configure your PostgreSQL connection inside:

```properties
application.properties
```

Flyway migrations will automatically initialise the database schema.

---

## Repository Structure

```text
API-Fuzzer
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── security
│   ├── models
│   ├── dto
│   └── flyway migrations
│
├── fuzzer-ui
│   ├── React
│   ├── Components
│   ├── Pages
│   └── Services
│
└── PostgreSQL
```

---

## Why This Project?

Many open-source API fuzzers focus solely on sending payloads to endpoints.

API Fuzzer aims to provide a complete API security testing platform by combining:

* Project management
* Endpoint management
* Payload libraries
* Automated fuzzing
* Response analysis
* Historical scan tracking

into a single modern web application.

The long-term vision is to evolve the platform into a complete API security assessment suite capable of importing API specifications, handling authenticated APIs, scheduling scans, and automatically identifying potential vulnerabilities.

---

## Contributing

Contributions, suggestions and feedback are always welcome.

If you have ideas for new payloads, detection techniques, architecture improvements or features, feel free to open an issue or submit a pull request.

---

## Disclaimer

This project is intended for educational purposes and authorised security testing only.

Only test systems that you own or have explicit permission to assess.
