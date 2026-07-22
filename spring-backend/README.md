# ExamPal Spring Boot Backend

Java (Spring Boot) backend that mirrors the existing Node.js API. The Node.js backend remains in the project but is no longer the default runtime.

## Quick Start

```bash
# From project root (uses config.env automatically)
npm start

# Or directly with Maven
cd spring-backend
mvn spring-boot:run
```

## Run Node.js backend (legacy)

```bash
npm run start:node
npm run dev:node
```

## URLs

| URL | Description |
|-----|-------------|
| http://localhost:5000/web | Frontend UI |
| http://localhost:5000/health | Health check |
| http://localhost:5000/api/* | REST API |

## Configuration

Settings are loaded from `config.env` at the project root (same file used by Node.js).

Key variables: `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`, `JWT_SECRET`, `AUTH_DISABLED`

## Stack

- Spring Boot 3.4 + Java 21
- Spring Data MongoDB (shared database with Node backend)
- Spring Security + JWT
- Google Gemini REST API
