# 🧱 LEGO Shop — Full-Stack E-Commerce App

A full-stack e-commerce web application for browsing and purchasing LEGO sets, built with the MERN stack (MongoDB, Express, React, Node.js).

## 📋 Project Overview

LEGO Shop is a full online store with separate customer and admin experiences. Customers can register, log in, browse products, add items to their cart, place orders, and manage their profile. Admins have access to a dedicated dashboard for managing the store.

## ✨ Features

- **User authentication** — register and log in with JWT-based auth, passwords hashed with bcrypt
- **Role-based access** — separate customer and admin permissions
- **Product browsing** — view and search available LEGO sets
- **Shopping cart & checkout** — add products to cart and place orders
- **Order history** — customers can view their past orders
- **Profile management** — update profile details, including profile photo upload
- **Admin dashboard** — manage products and orders from a dedicated admin view
- **File uploads** — profile picture uploads handled via Multer
- **Form validation** — server-side validation with express-validator
- **Centralized error handling** — consistent API error responses

## 🏗️ Tech Stack

**Frontend:**
- React 19
- React Router
- Axios
- SCSS

**Backend:**
- Node.js / Express
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- Multer for file uploads
- express-validator for input validation

## 📁 Project Structure

```
Lego/
├── client/                # React frontend
│   └── src/
│       ├── components/    # Homepage, Login, Register, Products, Cart,
│       │                  # Order History, Profile, Admin Dashboard, Navbar
│       ├── config/        # Global constants
│       └── scss/          # Stylesheets
│
└── server/                # Node/Express backend
    ├── config/            # DB connection, JWT config
    ├── middleware/        # Auth, upload, error handling
    ├── models/            # User, Product, Order (Mongoose schemas)
    ├── routes/            # /api/users, /api/products, /api/orders
    └── server.js          # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/abdihafidgahayr2-glitch/Lego.git
cd Lego
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/config/` with the following variables:
```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_PRIVATE_KEY_FILENAME=jwt_private_key.pem
JWT_EXPIRY=1d
```

You'll also need to generate your own `jwt_private_key.pem` file in `server/config/` (this is not included in the repository for security reasons).

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
npm start
```

The app will run on `http://localhost:3000` with the API on `http://localhost:4000`.

## 🔌 API Overview

| Route | Description |
|---|---|
| `POST /api/users/register` | Register a new user |
| `POST /api/users/login` | Log in and receive a JWT |
| `GET /api/products` | Get all products |
| `POST /api/orders` | Place a new order |
| `GET /api/orders` | Get order history |
| `GET /api/health` | Health check |

## 🔒 Security Notes

This repository does **not** include the `.env` file, the JWT private key, or uploaded user files — these are excluded via `.gitignore` and must be configured locally as described above.

## 👤 Author

**Abdihafid Gahayr** — [LinkedIn](https://www.linkedin.com/in/abdihafid-gahayr-166134405/)
