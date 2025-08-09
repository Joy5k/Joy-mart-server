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

