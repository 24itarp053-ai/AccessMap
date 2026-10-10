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
```

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

### 📍 Public Places API
- `GET /api/places`
  - Retrieve list of public places with filtering, search, and pagination.
  - **Query Parameters**:
    - `q` — Free text search across name, description, address, and area.
    - `category` — Filter by category (`transit`, `park`, `hospital`, `government`, `education`, `commercial`, `other`).
    - `area` — Filter by area/neighborhood (e.g., `Demo Area`).
    - `dataStatus` — Filter by status (`sample`, `unverified`, `verified`).
    - `page` — Page number (default: `1`).
    - `limit` — Results per page (default: `10`, max: `100`).
  - **Example Request**:
    `GET http://localhost:5000/api/places?category=park&area=Demo%20Area`

- `GET /api/places/:id`
  - Retrieve detailed information for a single place by its MongoDB ObjectId.
  - **Example Request**:
    `GET http://localhost:5000/api/places/65f123456789abcdef012345`

---

## 🛠️ Architecture & Conventions
- **ES Modules**: Standard `import` / `export` syntax.
- **Centralized Error Handling**: Errors return safe, formatted JSON without exposing production stack traces.
- **Graceful Shutdown**: Intercepts `SIGINT` / `SIGTERM` signals to cleanly close HTTP listeners and MongoDB connections.
