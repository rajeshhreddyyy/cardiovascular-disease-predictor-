# Heart Prediction Backend (Node.js + Express + MySQL)

## Setup

1. Copy `.env.example` to `.env` and set real credentials.
2. Create DB/tables using `sql/schema.sql`.
3. Install dependencies and run server:

```bash
npm install
npm run dev
```

## Environment Variables

- `PORT`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

## API Endpoints

### Auth

- `POST /api/auth/register`
  - body: `{ "name": "Jay", "email": "jay@example.com", "password": "secret123" }`
- `POST /api/auth/login`
  - body: `{ "email": "jay@example.com", "password": "secret123" }`
  - response contains `token`

### Patient (Protected)

- `POST /api/patient`
  - header: `Authorization: Bearer <token>`
  - body: patient form data + prediction output
- `GET /api/patient/history`
  - header: `Authorization: Bearer <token>`

## Health Check

- `GET /api/health`
