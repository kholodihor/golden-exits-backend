# Golden Exits Backend

![Golden Exits](https://img.shields.io/badge/Golden%20Exits-Backend-gold)
![Hono](https://img.shields.io/badge/Hono-4.5.7-blue?logo=hono)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.5.3-47A248?logo=mongodb)

A modern Node.js backend API for the Golden Exits platform. Built with Hono, TypeScript, and MongoDB to provide authentication, blog posts, comments, and e-commerce functionality.

## 🌟 Features

- **RESTful API** - Clean API design following REST principles
- **Authentication** - Secure JWT-based authentication system
- **Blog Management** - CRUD operations for blog posts and comments
- **E-commerce** - Product management and shopping cart functionality
- **Media Content** - Video and image upload/management
- **MongoDB Integration** - Efficient data storage and retrieval
- **TypeScript** - Type-safe codebase for better developer experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kholodihor/golden-exits-backend.git
   cd golden-exits-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/golden-exits
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. Start the development server:

   ```bash
   npm run start
   # or
   yarn start
   ```

5. The API will be available at:

   ```
   http://localhost:4000
   ```

## 🛠️ Tech Stack

- **Hono** - Lightweight web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Media storage
- **Zod** - Schema validation
- **Stripe** - Payment processing

## 📁 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── libs/           # Shared libraries
├── middleware/     # Express middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── schema/         # Validation schemas
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/user` - Get current user info

### Blog
- `GET /posts` - Get all blog posts
- `GET /posts/:id` - Get a specific post
- `POST /posts` - Create a new post
- `PATCH /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

### Comments
- `GET /comments/:postId` - Get all comments for a post
- `POST /comments` - Create a new comment
- `DELETE /comments/:id` - Delete a comment

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product
- `POST /products` - Create a new product
- `PATCH /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

## 🧪 Scripts

- `npm run start` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
