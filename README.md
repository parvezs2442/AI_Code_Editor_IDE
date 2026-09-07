# 🧠 VertexAI - AI Code Editor IDE

A full-stack, AI-powered cloud code editor built on a high-performance **microservices architecture** using React (Vite), Node.js/Express, MongoDB, Redis, Firebase Auth, and an API Gateway.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React + Vite)                │
│                  http://localhost:5173                  │
│        - VertexAI Dashboard (Projects & Starred)        │
│        - Google 1-Click Auth via Firebase               │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP + HttpOnly Cookies (Axios)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 API Gateway (Express)                   │
│                 http://localhost:3000                   │
│   - Session lookup via Redis & x-user-id injection      │
│   - Cookie preservation across microservices            │
│                                                         │
│   /api/auth ──────────────► Auth Service (:3001)        │
│   /api/project ───────────► Project Service (:3002)     │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
               ▼                          ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│ Auth Service (:3001)    │    │ Project Service (:3002)  │
│ - Firebase Admin SDK    │    │ - Project CRUD           │
│ - MongoDB (Users)       │    │ - Star / Unstar          │
│ - Redis (Session Store) │    │ - Redis Cache Layer      │
│                         │    │ - MongoDB (Projects)     │
└─────────────────────────┘    └──────────────────────────┘
```

---

## 📁 Project Structure

```
AI_CodeEditor_IDE/
├── frontend/                      # React + Vite client
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateProjectModal.jsx # Create Project dialog
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global user session
│   │   ├── features/
│   │   │   ├── auth.js            # Me & Logout API
│   │   │   ├── login.js           # Login API
│   │   │   └── projects.js        # Project CRUD API
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # VertexAI Dashboard UI
│   │   │   └── LoginPage.jsx
│   │   ├── utils/
│   │   │   └── axios.js           # Configured Axios with credentials
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── firebase.js                # Firebase client config
│   └── .env                       # Frontend env vars
│
└── backend/
    ├── gateway/                   # API Gateway (Port 3000)
    │   ├── utils/
    │   │   └── proxyWithHeader.js # Header and session proxy
    │   └── index.js
    ├── shared/
    │   └── redis/
    │       └── redis.js           # Centralized ioredis connection
    └── services/
        ├── auth/                  # Auth Microservice (Port 3001)
        │   ├── controllers/
        │   ├── routes/
        │   ├── models/
        │   └── config/
        └── project/               # Project Microservice (Port 3002)
            ├── controller/
            │   └── project.controller.js
            ├── routes/
            │   └── project.route.js
            ├── model/
            │   └── project.model.js
            └── index.js
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v6, Axios, Vanilla CSS |
| **Auth** | Firebase Authentication (Google OAuth) + Firebase Admin SDK |
| **Gateway** | Express.js, express-http-proxy, cookie-parser |
| **Microservices** | Express.js, Mongoose, ioredis |
| **Caching & Sessions** | Redis (TTL cached project lists & 7-day session store) |
| **Database** | MongoDB Atlas |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Redis Server (local or cloud instance running on port 6379)
- [Firebase Project](https://console.firebase.google.com/) with Google Auth enabled
- MongoDB Atlas cluster
- Firebase `serviceAccountKey.json` inside `backend/services/auth/`

---

### 1. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_SERVER_URL=http://localhost:3000
```

Start dev server:

```bash
npm run dev
# Runs on http://localhost:5173
```

---

### 2. API Gateway Setup

```bash
cd backend/gateway
npm install
```

Create `backend/gateway/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
AUTH_URL=http://localhost:3001
PROJECT_SERVICE=http://localhost:3002
REDIS_URL=redis://localhost:6379
```

Start the gateway:

```bash
npm run dev
# Runs on http://localhost:3000
```

---

### 3. Auth Service Setup

```bash
cd backend/services/auth
npm install
```

Place `serviceAccountKey.json` inside `backend/services/auth/`.

Create `backend/services/auth/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/user
REDIS_URL=redis://localhost:6379
```

Start auth service:

```bash
npm run dev
# Runs on http://localhost:3001
```

---

### 4. Project Service Setup

```bash
cd backend/services/project
npm install
```

Create `backend/services/project/.env`:

```env
PORT=3002
FRONTEND_URL=http://localhost:5173
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/project
REDIS_URL=redis://localhost:6379
```

Start project service:

```bash
npm run dev
# Runs on http://localhost:3002
```

---

## 🌐 API Reference

### Authentication Endpoints (`/api/auth`)

- `POST /api/auth/login` - Verify Firebase ID token, create/find user, set HttpOnly session cookie.
- `GET /api/auth/me` - Validate session from Redis and return current user data.
- `POST /api/auth/logout` - Clear Redis session and delete cookie.

### Project Endpoints (`/api/project`)

- `POST /api/project` - Create a new project `{ name, description }`.
- `GET /api/project` - Get all projects for authenticated user (cached in Redis).
- `GET /api/project/starred` - Get starred projects for authenticated user (cached in Redis).
- `GET /api/project/:id` - Get specific project by ID and update `lastOpenedAt`.
- `PATCH /api/project/:id` - Toggle project star status (invalidates user cache).
- `DELETE /api/project/:id` - Delete project (invalidates user cache).

---

## 📜 License

ISC
