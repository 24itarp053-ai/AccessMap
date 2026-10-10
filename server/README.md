# AccessMap Backend API

Backend API service for **AccessMap**, an accessibility mapping platform for Ahmedabad developed for the Cloud Counselage Social Impact Hackathon under the theme *Smart & Inclusive Communities*.

---

## 🚀 Quick Start

### 1. Installation
Ensure Node.js (v18+) and MongoDB are installed.
```bash
cd server
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/accessmap
JWT_SECRET=your_secure_random_jwt_secret_at_least_32_chars_long
JWT_EXPIRES_IN=7d
```

> **Security Notice**: `JWT_SECRET` must be a strong, cryptographically secure secret string of at least 32 characters. Never commit `.env` or use default placeholder values in production.
> You can generate a random secret via Node.js CLI:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 3. Database Seeding
To populate sample places for local testing and demonstration:
```bash
npm run seed
```
> **Note on Sample Data:** Seeded places are marked with `dataStatus: "sample"`. Accessibility features and notes included in seed data are illustrative for hackathon demonstration purposes and require real-world verification.

### 4. Running the API
- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## 📡 API Endpoints

### 🟢 Health Check
- `GET /api/health`
  - Returns service status and MongoDB connection state (`connected` / `disconnected`).

### 🔐 Authentication & Authorization API

- `POST /api/auth/register`
  - Public registration for new user accounts.
  - **Role Security**: Public registration hardcodes `role: "user"`. Client-supplied role attempts are ignored.
  - **Validation Rules**:
    - `name` *(required)* — String, 2 to 100 characters.
    - `email` *(required)* — Valid normalized email address (unique).
    - `password` *(required)* — String, 8 to 128 characters (maximum 72 UTF-8 bytes to prevent bcrypt truncation).
  - **Example Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "SecurePassword123"
    }
    ```
  - **Example Response (201 Created)**:
    ```json
    {
      "status": "success",
      "message": "User registered successfully",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": "65f123456789abcdef012345",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "user",
          "createdAt": "2026-10-10T16:00:00.000Z"
        }
      }
    }
    ```

- `POST /api/auth/login`
  - User authentication and JWT token issuance.
  - **Example Request Body**:
    ```json
    {
      "email": "jane@example.com",
      "password": "SecurePassword123"
    }
    ```
  - **Example Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": "65f123456789abcdef012345",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "user"
        }
      }
    }
    ```

- `GET /api/auth/me`
  - Protected endpoint returning profile information for the authenticated user.
  - **Header Required**: `Authorization: Bearer <token>`
  - **Example Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "user": {
          "id": "65f123456789abcdef012345",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "user"
        }
      }
    }
    ```

### 📍 Public Places API
- `GET /api/places`
  - Retrieve list of public places with filtering, search, and pagination.
  - **Query Parameters**:
    - `q` — Free text search across name, description, address, and area (max 100 characters).
    - `category` — Filter by category (`transit`, `park`, `hospital`, `government`, `education`, `commercial`, `other`).
    - `area` — Filter by area/neighborhood.
    - `dataStatus` — Filter by status (`sample`, `unverified`, `verified`).
    - `page` — Positive integer page number (default: `1`).
    - `limit` — Results per page (default: `10`, max: `100`).
  - **Example Request**:
    `GET http://localhost:5000/api/places?category=park`

- `GET /api/places/:id`
  - Retrieve detailed information for a single place by its MongoDB ObjectId.

### 🚧 Accessibility Barrier Reports API

- `POST /api/reports`
  - Public submission of an accessibility barrier report.
  - **Status Protection**: Submitted reports are automatically initialized to `status: "pending"`. Client-supplied status inputs are strictly ignored.
  - **Tracking Code**: Automatically assigns a unique random tracking code in `REP-XXXXXXXX` format.
  - **Validation Rules**:
    - `description` *(required)* — String, 10 to 1000 characters.
    - `category` *(required)* — Must be one of: `wheelchair_access`, `ramp`, `elevator`, `tactile_paving`, `accessible_toilet`, `signage`, `obstacle`, `other`.
    - `placeId` *(optional)* — Valid MongoDB ObjectId referencing an existing Place.
    - `location` *(optional)* — Object containing numeric `latitude` (-90 to 90) and `longitude` (-180 to 180). Both fields are required if location is provided.
    - `photoUrl` *(optional)* — Valid HTTP or HTTPS URL reference (max 2048 characters). *Note: `photoUrl` is a URL reference only; direct file uploads are not implemented in this phase.*
  - **Example Request Body**:
    ```json
    {
      "description": "Wheelchair ramp at entrance is blocked by temporary scaffolding.",
      "category": "ramp",
      "placeId": "65f123456789abcdef012345",
      "location": {
        "latitude": 23.0225,
        "longitude": 72.5714
      },
      "photoUrl": "https://example.com/photos/ramp-blocked.jpg"
    }
    ```
  - **Example Response (201 Created)**:
    ```json
    {
      "status": "success",
      "message": "Report submitted successfully",
      "data": {
        "trackingCode": "REP-8A2F9B1C",
        "status": "pending",
        "category": "ramp",
        "description": "Wheelchair ramp at entrance is blocked by temporary scaffolding.",
        "placeId": "65f123456789abcdef012345",
        "location": {
          "latitude": 23.0225,
          "longitude": 72.5714
        },
        "photoUrl": "https://example.com/photos/ramp-blocked.jpg",
        "createdAt": "2026-10-10T15:35:00.000Z"
      }
    }
    ```

- `GET /api/reports/track/:trackingCode`
  - Public status lookup for a submitted report using its tracking code.
  - **Privacy Guarantee**: Exposes only non-sensitive public fields: `trackingCode`, `status`, `category`, `description`, `createdAt`, `updatedAt`. Does not expose database IDs (`_id`, `__v`), `placeId`, `photoUrl`, or internal fields.
  - **Example Request**:
    `GET http://localhost:5000/api/reports/track/REP-8A2F9B1C`
  - **Example Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "trackingCode": "REP-8A2F9B1C",
        "status": "pending",
        "category": "ramp",
        "description": "Wheelchair ramp at entrance is blocked by temporary scaffolding.",
        "createdAt": "2026-10-10T15:35:00.000Z",
        "updatedAt": "2026-10-10T15:35:00.000Z"
      }
    }
    ```

---

## 🛠️ Architecture & Conventions
- **ES Modules**: Standard `import` / `export` syntax.
- **Security**: Passwords hashed with `bcryptjs` (salt round 10). Passwords excluded from all queries and JSON responses (`select: false`). Passwords checked for 72 UTF-8 byte limit. JWT signed with `HS256`.
- **Centralized Error Handling**: Errors return safe, formatted JSON without exposing production stack traces.
- **Graceful Shutdown**: Intercepts `SIGINT` / `SIGTERM` signals to cleanly close HTTP listeners and MongoDB connections.
