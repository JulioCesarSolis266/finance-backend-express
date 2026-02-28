Finance API – Backend

A modular RESTful API built with Node.js and Express for managing authentication, transactions, categories, and reports.

This project follows a domain-based modular architecture and includes API documentation using Swagger.

Tech Stack

Node.js

Express.js

PostgreSQL

Prisma ORM

JWT Authentication

Swagger (OpenAPI)

Project Structure
src/
 ├── config/
 |     ├── prisma.js
 │     ├── swagger.js
 │     ├── swagger.path.js
 │     └── swagger.schema.js
 │
 │
 └── modules/
       ├── auth/
       │     ├── auth.controller.js
       │     ├── auth.routes.js
       │     ├── auth.service.js
       │     └── auth.middleware.js
       │
       ├── transactions/
       ├── category/
       └── reports/


The project follows a modular structure where each domain encapsulates its controller, routes, services, and domain-specific middleware.

Features

User authentication with JWT

Protected routes

CRUD operations for transactions

Category management

Financial reports

API documentation with Swagger

Prisma ORM integration

Environment-based configuration

Environment Variables

Create a .env file based on .env.example.

Required variables:

PORT=
DATABASE_URL=
JWT_SECRET=


Do not commit your .env file.

Installation

Clone the repository:

git clone https://github.com/JulioCesarSolis266/finance-backend-express.git
cd your-repository


Install dependencies:

npm install


Set up environment variables:

cp .env.example .env


Run Prisma migrations:

npx prisma migrate dev


Start the development server:

npm run dev

API Documentation

Swagger is configured inside the config directory:

swagger.js → Swagger configuration

swagger.path.js → Route definitions

swagger.schema.js → Schema definitions

Once the server is running, access the documentation at:

http://localhost:PORT/api-docs

Available Scripts
npm run dev       # Start development server
npm run start     # Start production server
npx prisma studio # Open Prisma Studio

Authentication

Protected routes require a Bearer token:

Authorization: Bearer <your_token>


JWT validation is handled by the auth.middleware.js inside the auth module.

