# 🔐 Authentication Microservice

A lightweight JWT-based authentication microservice built with Node.js and Express.js.

## 📋 Overview

This microservice provides JWT token generation, verification, and refresh functionality using API key authentication. Perfect for securing microservices architecture.

## 🛠️ Technical Stack

- **Language**: Node.js (JavaScript ES6+)
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Logging**: Morgan
- **Environment**: dotenv

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/cecexp/microservices.git
cd microservices
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
JWT_SECRET=your_super_strong_jwt_secret_key_change_this_in_production_32chars_min
PORT=4000
API_KEYS={"serviceA":"your_key","serviceB":"your_key","serviceC":"your_key"}
```

4. Start the server:

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```
## 🌐 API Endpoints

Base URL: `http://localhost:4000/api`

### Health Check
Check if the service is running.

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-06T10:30:00.000Z",
  "service": "authentication-service",
  "version": "1.0.0"
}
```

---

### Generate Token
Create a new JWT token using a valid API key.

```http
POST /api/token
Content-Type: application/json

{
  "apiKey": "SERVICE_A_API_KEY_12345"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing or invalid API key format
- `401`: Invalid API key

---

### Verify Token
Verify if a token is valid.

```http
GET /api/token/verify
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "message": "Token is valid.",
  "user": {
    "apiKey": "SERVICE_A_API_KEY_12345",
    "iat": 1699264200,
    "exp": 1699267800
  }
}
```

**Error Responses:**
- `401`: Missing token
- `403`: Invalid or expired token

---

### Refresh Token
Get a new token using an existing valid token.

```http
POST /api/token/refresh
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Missing token
- `403`: Invalid or expired token

---

## 📝 Usage Examples

### Using cURL

**1. Generate a token:**
```bash
curl -X POST http://localhost:4000/api/token \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "SERVICE_A_API_KEY_12345"}'
```

**2. Verify a token:**
```bash
curl -X GET http://localhost:4000/api/token/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**3. Refresh a token:**
```bash
curl -X POST http://localhost:4000/api/token/refresh \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript (fetch)

```javascript
// Generate token
const response = await fetch('http://localhost:4000/api/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ apiKey: 'SERVICE_A_API_KEY_12345' })
});
const { token } = await response.json();

// Use token in subsequent requests
const verifyResponse = await fetch('http://localhost:4000/api/token/verify', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🏗️ Project Structure

```
microservices/
├── src/
│   ├── authentication/
│   │   └── auth.js           # JWT token logic
│   ├── routes/
│   │   └── routes.js         # API endpoints
│   └── utils/
│       └── apiKeyValidator.js # API key validation
├── .env                       # Environment variables (not in git)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── index.js                  # Application entry point
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ API key validation
- ✅ Token expiration (1 hour)
- ✅ Bearer token format enforcement
- ✅ Environment variable configuration
- ✅ CORS support for cross-origin requests
- ✅ Input validation on token generation

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT signing | - | ✅ Yes |
| `PORT` | Server port | 3000 | ❌ No |
| `API_KEYS` | JSON string of valid API keys | - | ✅ Yes |
| `NODE_ENV` | Environment (development/production) | development | ❌ No |

### API Keys Format

API keys should be provided as a JSON string in the `.env` file:

```env
API_KEYS={"serviceA":"key1","serviceB":"key2","serviceC":"key3"}
```

## 🐛 Error Handling

The service includes centralized error handling:

- **400**: Bad Request (invalid input)
- **401**: Unauthorized (missing/invalid API key)
- **403**: Forbidden (invalid/expired token)
- **404**: Not Found (invalid route)
- **500**: Internal Server Error

## 📊 Logging

Request logging is handled by Morgan in development mode. All requests are logged with:
- HTTP method
- URL
- Status code
- Response time

## ⚠️ Known Limitations

- API keys are stored in environment variables (consider using a secrets manager for production)
- No rate limiting implemented (recommended for production)
- In-memory key validation (consider database for scalability)
- No refresh token rotation strategy

## 🚀 Deployment

### Production Checklist

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Use secure API keys
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Use HTTPS in production
- [ ] Consider Redis for token blacklisting

## 📄 License

ISC

## 👤 Author

Ludim Rodriguez and Hector Ortiz

## 🤝 Contributing

This is an academic/learning project. Feel free to fork and experiment!

---

**Version**: 1.0.0  
**Last Updated**: November 6, 2025
