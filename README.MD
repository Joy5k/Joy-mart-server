<<<<<<< HEAD
JoyMart Backend API Documentation
Table of Contents
API Base URL

Authentication

API Endpoints

Environment Variables

Development Setup

Deployment

Error Handling

Testing

Contact

API Base URL
text
https://joy-mart-server.vercel.app/api/v1
Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
API Endpoints
Auth Routes (/auth)
Endpoint	Method	Description	Required Fields
/auth/signup	POST	User registration	name, email, password, etc.
/auth/login	POST	User login	email, password
/auth/refresh-token	POST	Refresh access token	refreshToken
User Routes (/users)
Endpoint	Method	Description
/users	GET	Get all users (Admin only)
/users/:id	GET	Get single user
/users/:id	PATCH	Update user
/users/:id	DELETE	Delete user
Product Routes (/product)
Endpoint	Method	Description
/product	GET	Get all products
/product/:id	GET	Get single product
/product	POST	Create new product
/product/:id	PATCH	Update product
/product/:id	DELETE	Delete product
Category Routes (/categories)
Endpoint	Method	Description
/categories	GET	Get all categories
/categories	POST	Create new category
Booking Routes (/booking)
Endpoint	Method	Description
/booking	POST	Create new booking
Environment Variables
Create a .env file in the root directory with the following variables:

text
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
PORT=5000
Development Setup
Clone the repository:

bash
git clone https://github.com/Joy5k/Joy-mart-server.git
Install dependencies:

bash
npm install
Start development server:

bash
npm run dev
Deployment
The API is automatically deployed to Vercel on pushes to the main branch.

To deploy manually:

bash
npm run build
npm run start:prod
Error Handling
The API returns standardized error responses:

json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": 404,
    "description": "Detailed error description"
  }
}
Testing
To run tests (currently placeholder):

bash
npm test
Contact
For any issues or questions, please contact:

Mehedi Hasan

Email: [your email]

GitHub: Joy5k

=======
# 🛒 JoyMart Server - Enhanced Documentation

Based on your provided environment file and routes, I'll update the documentation to better reflect your complete system.

## 🔧 Tech Stack (Updated)

- **Node.js** (v18+ recommended)
- **Express.js**
- **TypeScript**
- **MongoDB Atlas** with **Mongoose**
- **Zod** for schema validation
- **bcryptjs** for password hashing (salt rounds: 10)
- **jsonwebtoken** for authentication (access & refresh tokens)
- **dotenv** for environment config
- **Cloudinary** for media storage
- **SSLCommerz** for payment processing
- **Nodemailer** for email services (Gmail SMTP)
- **Vercel** for CI/CD deployment

## ✨ Features (Enhanced)

- ✅ **Multi-role system** (Super Admin, Admin, Seller, Customer)
- ✅ **JWT authentication** with access (7d) and refresh tokens (365d)
- ✅ **Product management** with categories and comments
- ✅ **Booking system** for appointments/services
- ✅ **Payment integration** with SSLCommerz
- ✅ **Reporting system** for products
- ✅ **Push notifications** system
- ✅ **Subscription service** for newsletters
- ✅ **Password reset** via email
- ✅ **Profile management** for all users
- ✅ **Admin dashboard** with comprehensive controls

## ⚙️ Installation (Updated)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/joymart-server.git
cd joymart-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

Create a `.env` file with all required variables (see your provided config).

## 🔐 Environment Variables (Complete List)

```env
# Environment
NODE_ENV="production"

# Server
PORT=5000

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Security
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=365d

# Payment
STORE_ID=your_sslcommerz_id
SLCOMMERZ_STORE_PASSWORD=your_sslcommerz_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
RESET_PASS_UI_LINK=https://your-frontend.com/reset-password

# URLs
FRONTEND_URL=https://your-frontend.com
BACKEND_URL=http://localhost:5000

# Defaults
DEFAULT_PASS=12345
SUPER_ADMIN_PASSWORD=admin_secret_password

# Vercel (for CI/CD)
VERCEL_PROJECT_ID=your_project_id
VERCEL_TOKEN=your_vercel_token
VERCEL_SCOPE=your_vercel_scope
VERCEL_ORG_ID=your_vercel_org_id
```

## 🚀 Running the Server

### Development mode:

```bash
npm run dev
```

### Production build:

```bash
npm run build
npm start
```

## 📁 Project Structure (Detailed)

```
src/
│
├── app/
│   ├── config/         # Configuration files
│   ├── DB/            # Database connection setup
│   ├── errors/        # Custom error classes
│   ├── hooks/         # Lifecycle hooks
│   ├── interface/     # TypeScript interfaces
│   ├── middlewares/   # Express middlewares
│   ├── modules/       # Feature modules
│   │   ├── Admin/     # Admin management
│   │   ├── Auth/      # Authentication
│   │   ├── booking/   # Booking system
│   │   ├── category/  # Product categories
│   │   ├── payment/   # Payment processing
│   │   ├── product/   # Product management
│   │   ├── profile/   # User profiles
│   │   ├── reportedProduct/ # Product reporting
│   │   ├── subscribe/ # Newsletter subscriptions
│   │   ├── user/      # User management
│   │   └── ...        # Other modules
│   ├── route/         # Main router
│   ├── utils/         # Utility functions
│   └── builder/       # Query builders
│
├── index.ts           # Server entry point
└── app.ts             # Express app setup
```
# 🛒 JoyMart Server API Documentation

## 📑 Table of Contents
- [Authentication](#-authentication-routes)
- [User Management](#-user-management)
- [Admin Management](#-admin-management)
- [Profile Management](#-profile-management)
- [Product Management](#-product-management)
- [Category Management](#-category-management)
- [Booking System](#-booking-system)
- [Payment System](#-payment-system)
- [Reported Products](#-reported-products)
- [Product Comments](#-product-comments)
- [Push Notifications](#-push-notifications)

---

## 🔐 Authentication Routes

### `POST /api/v1/auth/register`
- Register a new user
- Required fields: See validation schema
- Access: Public

### `POST /api/v1/auth/login`
- User login
- Returns: Access token & refresh token
- Access: Public

### `POST /api/v1/auth/change-password`
- Change user password
- Required: Old password, new password
- Access: All authenticated roles

### `POST /api/v1/auth/refresh-token`
- Get new access token using refresh token
- Access: Public (with valid refresh token)

### `POST /api/v1/auth/forget-password`
- Initiate password reset
- Required: Email
- Access: Public

### `POST /api/v1/auth/reset-password`
- Complete password reset
- Required: Token, new password
- Access: Public

### `POST /api/v1/auth/logout`
- Invalidate refresh token
- Access: All authenticated roles

### `POST /api/v1/auth/social-login`
- Login via social providers
- Access: Public

---

## 👥 User Management

### `POST /api/v1/users/create`
- Create new user
- Access: Public (or restricted based on your config)

### `POST /api/v1/users/createUserByAdmin`
- Create user by admin
- Access: Admin/SuperAdmin

### `POST /api/v1/users/create-admin`
- Create new admin
- Required: Admin privileges
- Access: Admin/SuperAdmin

### `GET /api/v1/users/me`
- Get current user profile
- Access: Admin/SuperAdmin

### `POST /api/v1/users/change-status/:id`
- Change user status (active/inactive)
- Access: Admin/SuperAdmin

### `GET /api/v1/users/`
- Get all users
- Access: Admin/SuperAdmin

### `PUT /api/v1/users/updateByAdmin/:email`
- Update user by admin
- Access: Admin/SuperAdmin

### `DELETE /api/v1/users/deleteBySuperAdmin`
- Delete user (super admin only)
- Access: SuperAdmin

---

## 👨‍💼 Admin Management

### `GET /api/v1/admins/`
- Get all admins
- Access: Admin/SuperAdmin

### `GET /api/v1/admins/:id`
- Get single admin details
- Access: Admin/SuperAdmin

### `PATCH /api/v1/admins/:id`
- Update admin information
- Access: Admin/SuperAdmin

### `DELETE /api/v1/admins/:adminId`
- Delete admin account
- Access: SuperAdmin

---

## 👤 Profile Management

### `POST /api/v1/profiles/create`
- Create user profile
- Access: All roles

### `GET /api/v1/profiles/all`
- Get all profiles (Admin view)
- Access: Admin/SuperAdmin

### `GET /api/v1/profiles/me`
- Get current user profile
- Access: All authenticated roles

### `PUT /api/v1/profiles/`
- Update profile
- Access: All authenticated roles

### `PUT /api/v1/profiles/become-seller-or-user`
- Switch between seller/user role
- Access: User/Seller

### `DELETE /api/v1/profiles/:id`
- Soft delete profile
- Access: All authenticated roles

---

## 🛍 Product Management

### `POST /api/v1/product/create`
- Create new product
- Access: Admin/SuperAdmin/Seller

### `PUT /api/v1/product/update/:productId`
- Update product
- Access: Admin/SuperAdmin/Seller

### `PUT /api/v1/product/soft-delete/:productId`
- Soft delete product
- Access: Admin/SuperAdmin/Seller

### `DELETE /api/v1/product/delete/:productId`
- Permanently delete product
- Access: SuperAdmin

### `GET /api/v1/product/getSingle-product/:productId`
- Get product by ID
- Access: Public

### `GET /api/v1/product/get-all-products`
- Get all products
- Access: Public

### `GET /api/v1/product/get-all-seller-products`
- Get products by seller
- Access: Admin/SuperAdmin/Seller

### `GET /api/v1/product/get-all-products-for-admin`
- Get all products (Admin view)
- Access: Admin/SuperAdmin

---

## 🗂 Category Management

### `POST /api/v1/categories/create`
- Create category
- Access: Admin/SuperAdmin

### `GET /api/v1/categories/`
- Get all categories
- Access: All roles

### `GET /api/v1/categories/get/:id`
- Get single category
- Access: Admin/SuperAdmin

### `PUT /api/v1/categories/update/:id`
- Update category
- Access: Admin/SuperAdmin

### `DELETE /api/v1/categories/delete/:id`
- Delete category
- Access: Admin/SuperAdmin

---

## 📅 Booking System

### `POST /api/v1/booking/`
- Create booking
- Access: All roles

### `GET /api/v1/booking/my-bookings`
- Get user's bookings
- Access: All roles

### `GET /api/v1/booking/:id`
- Get booking by ID
- Access: All roles

### `PATCH /api/v1/booking/:id/status`
- Update booking status
- Access: All roles

### `DELETE /api/v1/booking/delete/:bookingId`
- Delete booking
- Access: All roles

### `GET /api/v1/booking/`
- Get all bookings (Admin view)
- Access: Admin/SuperAdmin

---

## 💳 Payment System

### `POST /api/v1/payment/initiate`
- Initiate payment
- Access: All roles

### `POST /api/v1/payment/validate/:transactionId`
- Validate payment
- Access: All roles

### `POST /api/v1/payment/ipn`
- Payment IPN listener
- Access: All roles

### `GET /api/v1/payment/track/:transactionId`
- Track order status
- Access: All roles

### `GET /api/v1/payment/history`
- Get payment history
- Access: All roles

---

## ⚠️ Reported Products

### `POST /api/v1/report/create`
- Report a product
- Access: All roles

### `GET /api/v1/report/all-by-admin`
- Get all reports (Admin view)
- Access: Admin/SuperAdmin

### `GET /api/v1/report/all-my-reported`
- Get user's reports
- Access: All roles

### `PUT /api/v1/report/reply/:id`
- Admin reply to report
- Access: Admin/SuperAdmin

### `DELETE /api/v1/report/delete/:id`
- Delete report
- Access: All roles

### `DELETE /api/v1/report/delete-by-admin/:id`
- Admin delete report
- Access: Admin/SuperAdmin

---

## 💬 Product Comments

### `POST /api/v1/productComment/`
- Create comment
- Access: All roles

### `GET /api/v1/productComment/:productId`
- Get comments for product
- Access: Public

### `DELETE /api/v1/productComment/:commentId`
- Delete comment
- Access: All roles

### `PUT /api/v1/productComment/:commentId`
- Update comment
- Access: All roles

---

## 🔔 Push Notifications

### `POST /api/v1/push-notifications/submit-token`
- Submit device token
- Access: Public

### `POST /api/v1/push-notifications/send-notification`
- Send notification
- Access: Admin/SuperAdmin

### `GET /api/v1/push-notifications/my-tokens`
- Get user's notification tokens
- Access: All roles

### `DELETE /api/v1/push-notifications/remove-token`
- Remove device token
- Access: All roles

---



## 🌐 Deployment

The project is configured for Vercel deployment with:

- Project ID: `prj_aPbxn6K2TwbtZmUehIEUBpFbu9Eg`
- Team scope: `team_KFfm2zm1vJMU1YW03b75yrEO`
- Automatic CI/CD pipeline

## 📝 License

MIT License

## 💬 Contact

**Developer:** Mehedi Hasan  
📧 Email: mmehedihasanjoyv@gmail.com  
🌐 Portfolio: [mehedihasan.dev](https://mehedihasan.dev)
>>>>>>> fd3f528aab4e0117263c37b2593d3d3e22d7586b
