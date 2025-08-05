# 🛒 JoyMart Server

**JoyMart Server** is a backend server built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. It powers the JoyMart ecommerce platform with features like user authentication, role management (Admin & Seller), product CRUD operations, and profile updates.

---

## 🔧 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **Zod** for schema validation
- **bcrypt** for password hashing
- **jsonwebtoken** for authentication
- **dotenv** for environment config

---

## ✨ Features

- ✅ User registration and login (JWT-based)
- ✅ Role-based access control (Admin, Seller)
- ✅ Secure password storage using bcrypt
- ✅ Add/Edit/Delete products (Seller role)
- ✅ Profile update (name, contact info)
- ✅ Admin dashboard (manage users & products)

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/joymart-server.git
cd joymart-server
```

### 2. Install dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of the project and configure it like this:

```env
PORT=5000
DATABASE_URL=mongodb+srv://your_username:your_password@cluster.mongodb.net/joymart?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10
```

---

## 🚀 Running the Server

### For development (with hot reloading):

```bash
npm run dev
```

### For production build:

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
│
├── app/
│   ├── modules/        # All feature modules (user, auth, product, etc.)
│   ├── middlewares/    # Error handling, auth middleware, etc.
│   ├── utils/          # Utility functions (e.g. jwt helpers)
│   ├── config/         # Config files (e.g. database connection)
│   └── routes/         # Central API routes
│
├── index.ts            # Server entry point
└── app.ts              # Express app setup
```

---

## 📡 API Routes Overview

| Method | Endpoint             | Description                     | Access     |
|--------|----------------------|----------------------------------|------------|
| POST   | `/api/v1/auth/signup`| Register a new user             | Public     |
| POST   | `/api/v1/auth/login` | Login user                      | Public     |
| GET    | `/api/v1/users/me`   | Get current user info           | Authenticated |
| PATCH  | `/api/v1/users/me`   | Update profile info             | Authenticated |
| POST   | `/api/v1/products`   | Add a new product               | Seller     |
| GET    | `/api/v1/products`   | Get all products                | Public     |
| PATCH  | `/api/v1/products/:id`| Update a product               | Seller     |
| DELETE | `/api/v1/products/:id`| Delete a product               | Seller     |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 💬 Contact

**Developer:** Mehedi Hasan  
📧 Email: mmehedihasanjoyv@gmail.com  
🌐 Portfolio: [mehedihasan.dev](https://mehedihasan.dev)

---
