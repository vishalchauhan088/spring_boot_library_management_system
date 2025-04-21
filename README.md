# Library Management System

A full-stack library management system built with Spring Boot and React.

## Features

- User authentication and authorization (Admin/User roles)
- Book management (CRUD operations)
- Book borrowing system with 30-day period
- Advanced book search with filters and pagination
- Borrowing history tracking
- Admin dashboard for managing books and borrowings
- User dashboard for viewing borrowed books

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.3
- Spring Security with JWT
- Spring Data JPA
- H2 Database
- Maven

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Material-UI for components
- Axios for API calls
- Vite for build tooling

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The server will start on http://localhost:8080

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The client will start on http://localhost:5173

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Book Endpoints
- GET /api/books - Get all books
- GET /api/books/{id} - Get book by ID
- GET /api/books/search - Search books with filters
- POST /api/books - Add new book (Admin only)
- PUT /api/books/{id} - Update book (Admin only)
- DELETE /api/books/{id} - Delete book (Admin only)

### Borrowing Endpoints
- POST /api/borrowings/borrow/{bookId} - Borrow a book
- POST /api/borrowings/return/{borrowingId} - Return a book (Admin only)
- GET /api/borrowings/user - Get user's borrowings
- GET /api/borrowings - Get all borrowings (Admin only)

## License

This project is licensed under the MIT License. 