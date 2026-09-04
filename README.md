# 🧠 AI Code Editor IDE

A full-stack, AI-powered code editor with Google OAuth authentication, built on a **microservices architecture** using React (Vite), Node.js/Express, MongoDB, Firebase Auth, and an API Gateway.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React + Vite)                │
│                  http://localhost:5173                  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (Axios)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 API Gateway (Express)                   │
│                 http://localhost:3000                   │
│                                                         │
│   /api/auth  ──────────────────────────────────────►   │
└──────────────────────────┬──────────────────────────────┘
                           │ Proxy
                           ▼
┌─────────────────────────────────────────────────────────┐
│             Auth Microservice (Express)                 │
│                 http://localhost:3001                   │
│   - Firebase Admin SDK (token verification)            │
│   - MongoDB (user storage)                             │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
AI_CodeEditor_IDE/
├── frontend/                      # React + Vite client
│   ├── src/
│   │   ├── features/
│   │   │   └── login.js           # Login API call
│   │   ├── utils/
│   │   │   └── axios.js           # Axios instance
│   │   ├── App.jsx                # Main component (Google login)
│   │   └── main.jsx
│   ├── firebase.js                # Firebase client config
│   └── .env                       # Frontend env vars (git-ignored)
│
└── backend/
    ├── gateway/                   # API Gateway
    │   ├── index.js
    │   └── .env                   # Gateway env vars (git-ignored)
    └── services/
        └── auth/                  # Auth Microservice
            ├── controllers/
            │   └── auth.controller.js
            ├── routes/
            │   └── auth.routes.js
            ├── config/
            │   ├── db.js          # MongoDB connection
            │   └── firebase.js    # Firebase Admin SDK init
            ├── models/
            │   └── userModel.js
            ├── serviceAccountKey.json  # ⚠️ DO NOT COMMIT
            ├── index.js
            └── .env               # Auth service env vars (git-ignored)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Axios, Firebase JS SDK |
| **Auth** | Firebase Authentication (Google OAuth) |
| **Gateway** | Express.js, express-http-proxy |
| **Auth Service** | Express.js, Firebase Admin SDK, Mongoose |
| **Database** | MongoDB Atlas |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Firebase Project](https://console.firebase.google.com/) with Google Auth enabled
- A MongoDB Atlas cluster
- Firebase `serviceAccountKey.json` (download from Firebase Console → Project Settings → Service Accounts)

---

### 1. Clone the Repository

```bash
git clone https://github.com/parvezs2442/AI_Code_Editor_IDE.git
cd AI_CodeEditor_IDE
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_SERVER_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
# Runs on http://localhost:5173
```

---

### 3. API Gateway Setup

```bash
cd backend/gateway
npm install
```

Create `backend/gateway/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
AUTH_URL=http://localhost:3001
```

Start the gateway:

```bash
npm run dev
# Runs on http://localhost:3000
```

---

### 4. Auth Microservice Setup

```bash
cd backend/services/auth
npm install
```

Place your `serviceAccountKey.json` inside `backend/services/auth/`.

Create `backend/services/auth/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/user
```

Start the auth service:

```bash
npm run dev
# Runs on http://localhost:3001
```

---

## 🔐 Authentication Flow

```
1. User clicks "Sign in with Google"
2. Firebase popup opens → user authenticates with Google
3. Firebase returns a short-lived ID Token to the frontend
4. Frontend POSTs the token to Gateway:  POST /api/auth/login
5. Gateway proxies the request to Auth Service
6. Auth Service verifies the token with Firebase Admin SDK
7. Decoded user info is returned as JSON to the frontend
```

---

## 🌐 API Reference

### `POST /api/auth/login`

Verifies a Firebase Google ID token and returns decoded user info.

**Request Body:**
```json
{
  "token": "<firebase_id_token>"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Error Response `400`:**
```json
{
  "success": false,
  "message": "Can't login user"
}
```

---

## 🔒 Security Notes

> ⚠️ **Never commit** `serviceAccountKey.json` or `.env` files — they are listed in `.gitignore`.

- Rotate Firebase service account keys periodically
- Use HTTPS and secure cookies in production
- Validate and sanitize all inputs on the backend

---

## 📜 License

ISC
