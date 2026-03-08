# AURUM Backend API

This is the Express.js REST API backend for the AURUM premium luxury jewelry website, powered by Node.js and Firebase Admin SDK.

## Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database & Auth:** Firebase Admin SDK (Firestore + Authentication)
- **Validation:** `express-validator`

---

## 🚀 Setup Instructions

### 1. Install Dependencies
Navigate to the `backend` directory and install the required npm packages:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
1. Copy the template `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and fill in your Firebase project details.

### 3. Get Your Firebase Service Account Key
To allow this Node.js server to securely talk to your Firebase database, you need a Service Account Key:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (`aurum-wsg`).
3. Click the **Gear Icon** (Project settings) next to "Project Overview".
4. Go to the **Service accounts** tab.
5. Click the **Generate new private key** button.
6. A JSON file will download. Open this file.
7. Copy the `client_email` and `private_key` values from the JSON and paste them into your `.env` file for the `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` variables respectively.
   *(Note: ensure the private key string starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----\n`)*

---

## 💻 Running the Server

### Development Mode (Auto-restarts on code changes)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

By default, the server will run on `http://localhost:5000`. You can test it by visiting `http://localhost:5000/api/health` in your browser.

---

## 🌐 API Endpoints Overview

All responses follow a standard `{ success: boolean, message: string, data/errors: array/object }` format.

### Health Check
- `GET /api/health` - Check if API is running

### Products (`/api/products`)
- `GET /` - Get all products (supports `?category=x&limit=10&sort=price_asc`)
- `GET /:id` - Get product by ID
- `POST /` - Create product *(Admin Only)*
- `PUT /:id` - Update product *(Admin Only)*
- `DELETE /:id` - Delete product *(Admin Only)*

### Consultations (`/api/consultations`)
- `POST /` - Submit a private consultation request
- `GET /` - Get all requests *(Admin Only)*
- `PATCH /:id/status` - Update request status *(Admin Only)*

### Orders (`/api/orders`)
- `POST /` - Place a new order *(Authenticated Users)*
- `GET /my` - Get current user's orders *(Authenticated Users)*
- `GET /` - Get all orders *(Admin Only)*
- `PATCH /:id/status` - Update order status *(Admin Only)*

### Newsletter (`/api/newsletter`)
- `POST /subscribe` - Subscribe to newsletter
- `DELETE /unsubscribe` - Unsubscribe from newsletter
- `GET /` - Get all subscribers *(Admin Only)*

### Authentication (`/api/auth`)
- `GET /me` - Get current decoded user info *(Authenticated Users)*
- `POST /set-admin` - Grant admin privileges to a user ID *(Admin Only)*

---

## 🛡️ Authentication & Authorization Rules
For protected endpoints, requests must include a valid Firebase ID Token in the Authorization header:
`Authorization: Bearer <your_firebase_id_token>`

- **Authenticated Users User** routes require *any* valid Firebase ID token.
- **Admin Only** routes require a valid Firebase ID token where the user has a custom claim `admin: true` set on their account.
