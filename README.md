# Fintech Platform Backend Scaffold

This repository contains a clean, modular Node.js + Express backend scaffold tailored for a Fintech platform using a PostgreSQL database, JWT authentication, and Bcrypt password hashing.

---

## Folder Structure

```text
MLK_2.0/
├── src/
│   ├── controllers/
│   │   └── authController.js     # User registration and login controller
│   ├── db/
│   │   └── index.js              # Database connection pool setup (pg)
│   ├── middlewares/
│   │   └── authMiddleware.js     # JWT route protection middleware
│   ├── routes/
│   │   └── authRoutes.js         # Endpoint definitions mapped to controllers
│   └── index.js                  # Main Express app initialization
├── .env                          # Local environment variables configuration
├── .env.example                  # Environment variables template
├── init-db.js                    # Standalone database table setup script
├── package.json                  # NPM packages, dependencies and runner scripts
└── README.md                     # Documentation and Setup instructions (this file)
```

---

## Setup & Running Instructions

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **PostgreSQL** (v12 or higher recommended)

### 2. Install Dependencies
Run the following command at the root of the project to install all dependencies:
```bash
npm install
```

### 3. Environment Variables Configuration
1. Copy the environment variables example file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your PostgreSQL credentials and a custom JWT secret key:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fintech_db
   JWT_SECRET=some_strong_random_secret_string
   ```

### 4. Initialize the Database
Run the database initialization script to automatically enable the `uuid-ossp` extension and create the required tables (`users`, `products`, `orders`, `investments`, `withdrawals`, `wompi_events`):
```bash
npm run init-db
```

### 5. Running the Server

#### Development Mode (With Nodemon auto-reloads)
```bash
npm run dev
```

#### Production Mode
```bash
npm run start
```

---

## API Endpoints

### 1. Register a New User
* **URL:** `/api/auth/register`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "full_name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword123",
    "phone": "+573000000000",
    "legal_id": "1234567890",
    "legal_id_type": "CC",
    "role": "user"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "user": {
        "id": "e229336d-998f-4ba9-b7b5-b7705187fa1d",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "+573000000000",
        "legal_id": "1234567890",
        "legal_id_type": "CC",
        "role": "user",
        "created_at": "2026-06-16T22:25:43.000Z"
      }
    }
  }
  ```

### 2. Log in / Get Access Token
* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "e229336d-998f-4ba9-b7b5-b7705187fa1d",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user"
      }
    }
  }
  ```

### 3. Get Authenticated User Details (Protected Route Example)
* **URL:** `/api/auth/me`
* **Method:** `GET`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully.",
    "data": {
      "user": {
        "id": "e229336d-998f-4ba9-b7b5-b7705187fa1d",
        "email": "johndoe@example.com",
        "role": "user",
        "iat": 1781682343,
        "exp": 1781768743
      }
    }
  }
  ```
