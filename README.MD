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

## 📡 API Routes (Complete Overview)

### Authentication (`/auth`)
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /forgot-password` - Initiate password reset
- `POST /reset-password` - Complete password reset

### Users (`/users`)
- `POST /` - Create new user
- `GET /` - Get all users (Admin only)
- `GET /:id` - Get user by ID
- `PATCH /:id` - Update user
- `DELETE /:id` - Delete user

### Admins (`/admins`)
- `POST /` - Create admin (Super Admin only)
- `GET /` - Get all admins
- `GET /:id` - Get admin by ID
- `PATCH /:id` - Update admin
- `DELETE /:id` - Delete admin

### Products (`/product`)
- `POST /` - Create product (Seller/Admin)
- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `PATCH /:id` - Update product
- `DELETE /:id` - Delete product

### Categories (`/categories`)
- `POST /` - Create category (Admin)
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `PATCH /:id` - Update category
- `DELETE /:id` - Delete category

### Bookings (`/booking`)
- `POST /` - Create booking
- `GET /` - Get all bookings (Admin) or user's bookings
- `GET /:id` - Get booking by ID
- `PATCH /:id` - Update booking status
- `DELETE /:id` - Cancel booking

### Payments (`/payment`)
- `POST /init` - Initialize payment
- `POST /validate` - Validate payment
- `GET /` - Get payment history
- `GET /:id` - Get payment details

### Reported Products (`/report`)
- `POST /` - Report a product
- `GET /` - Get all reports (Admin)
- `GET /:id` - Get report details
- `PATCH /:id` - Update report status
- `DELETE /:id` - Dismiss report

### Product Comments (`/productComment`)
- `POST /` - Add comment
- `GET /` - Get comments for product
- `PATCH /:id` - Update comment
- `DELETE /:id` - Delete comment

### Push Notifications (`/push-notifications`)
- `POST /` - Create notification
- `GET /` - Get user notifications
- `PATCH /:id` - Mark as read
- `DELETE /:id` - Delete notification

### Profiles (`/profiles`)
- `GET /me` - Get current user profile
- `PATCH /me` - Update profile
- `POST /upload` - Upload profile picture

### Subscriptions (`/subscribe`)
- `POST /` - Subscribe to newsletter
- `GET /` - Get all subscribers (Admin)
- `DELETE /:id` - Unsubscribe

## 🔒 Security Considerations

1. **Database**: Uses MongoDB Atlas with SRV connection string
2. **Passwords**: Hashed with bcrypt (10 salt rounds)
3. **Tokens**: 
   - Access token expires in 7 days
   - Refresh token expires in 365 days
4. **Sensitive Data**: 
   - Never commit actual credentials to version control
   - Use environment variables for all secrets
5. **Payment**: SSLCommerz integration with store credentials

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
