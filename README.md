# ReviewFlix

A movie review and recommendation platform that helps users discover, review, and get personalized movie recommendations.

## Features

- User authentication (registration and login)
- Movie reviews and ratings
- Personalized movie recommendations based on user preferences
- User profile management
- Movie discovery based on genres and preferences

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT (JSON Web Tokens)
- Password Hashing: bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication

#### Register User
- **POST** `/api/users/register`
- Body: `{ "username": "string", "email": "string", "password": "string" }`

#### Login
- **POST** `/api/users/login`
- Body: `{ "email": "string", "password": "string" }`

### User Profile

#### Get Profile
- **GET** `/api/users/profile`
- Headers: `Authorization: Bearer {token}`

#### Update Preferences
- **PUT** `/api/users/preferences`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "genres": ["string"], "favoriteMovies": ["string"] }`

### Reviews

#### Add Review
- **POST** `/api/reviews`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "movieId": "string", "rating": number, "review": "string" }`

#### Get Movie Reviews
- **GET** `/api/reviews/{movieId}`

#### Get User Reviews
- **GET** `/api/reviews/user/{userId}`
- Headers: `Authorization: Bearer {token}`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.