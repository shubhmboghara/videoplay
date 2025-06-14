# VideoHub

## Project Overview

VideoHub is a full-stack video-sharing platform designed to provide users with a seamless experience for uploading, watching, and interacting with video content. This repository contains both the frontend and backend components of the application.

## Architecture Overview

VideoHub follows a client-server architecture. The **Frontend** (React.js) serves as the user interface, handling all presentation logic and user interactions. It communicates with the **Backend** (Node.js/Express) via RESTful API calls. The Backend is responsible for business logic, data persistence (MongoDB), authentication, and handling file uploads.

- **Frontend-Backend Communication**: The frontend makes HTTP requests (e.g., using Axios) to the backend API endpoints to fetch data, send user inputs, and manage resources.
- **Data Flow**: User actions on the frontend trigger API calls to the backend. The backend processes these requests, interacts with the MongoDB database, and sends back appropriate responses (e.g., JSON data, status codes).
- **Authentication Flow**: JWTs are used for secure authentication. Upon successful login, the backend issues an access token and a refresh token. The access token is used for subsequent authenticated requests, while the refresh token is used to obtain new access tokens when the current one expires.

## Frontend

### Project Description

VideoHub Frontend is the client-side application for a video-sharing platform, built with React.js. It provides a rich user interface for browsing, watching, uploading, and managing videos, as well as interacting with other users through comments and subscriptions.

### Features

- **User Authentication**: Secure sign-up, login, and logout functionalities.
- **Video Upload**: Users can upload their videos with titles, descriptions, and thumbnails.
- **Video Playback**: Seamless video streaming with a responsive player.
- **Video Discovery**: Browse videos by categories, search functionality, and personalized recommendations.
- **User Profiles**: View and manage personal profiles, including uploaded videos and watch history.
- **Subscriptions**: Subscribe to channels and receive updates on new content.
- **Comments**: Engage with videos by posting and replying to comments.
- **Responsive Design**: Optimized for various screen sizes, from desktops to mobile devices.

### Advanced Implementation Details

- **State Management with Redux Toolkit**: Utilizes Redux Toolkit for predictable and scalable state management across the application. Asynchronous operations (e.g., API calls) are handled using Redux Thunks, ensuring a clean separation of concerns and maintainable data flow.
- **Optimized Rendering with React.memo and useCallback**: Components are optimized for performance using `React.memo` to prevent unnecessary re-renders and `useCallback` to memoize functions passed to child components, reducing computational overhead.
- **Responsive Design with Tailwind CSS**: Implemented a mobile-first responsive design approach using Tailwind CSS utility classes, ensuring a consistent and adaptive user experience across various devices and screen sizes.
- **Efficient Data Fetching with Axios Interceptors**: Axios is configured with interceptors to automatically handle common tasks such as attaching authentication tokens to outgoing requests and refreshing expired tokens, streamlining API interactions and improving security.

### Advanced Implementation Details

- **Robust Authentication with JWT and Cookie-based Storage**: Implemented a secure authentication system using JSON Web Tokens (JWTs) with both access and refresh tokens. Refresh tokens are stored in secure, HTTP-only cookies to mitigate XSS attacks, enhancing overall security.
- **Cloud-based Media Management with Cloudinary**: Integrated Cloudinary for efficient and scalable storage and delivery of video and image files. This offloads media handling from the server, improving performance and reliability.
- **Centralized Error Handling and Asynchronous Error Wrapping**: Developed a centralized error handling middleware to catch and process errors consistently across the application. Asynchronous route handlers are wrapped to ensure that any unhandled promise rejections are caught and passed to the error handling middleware, preventing server crashes.
- **Database Abstraction with Mongoose Schemas and Models**: Utilized Mongoose to define clear schemas and models for MongoDB, providing a robust and organized way to interact with the database. This includes data validation, pre-save hooks for password hashing, and efficient querying.
- **API Rate Limiting and Security Headers**: Implemented rate limiting on API endpoints to prevent abuse and brute-force attacks. Additionally, various security headers are configured to protect against common web vulnerabilities.

### Technologies Used

- **React.js**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **React Router DOM**: For declarative routing in React applications.
- **Redux Toolkit**: For efficient state management.
- **Axios**: For making HTTP requests to the backend API.
- **Vite**: A fast build tool for modern web projects.

### Setup Instructions

Follow these steps to get the VideoHub Frontend up and running on your local machine.

#### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn

#### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd VideoHub/Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file:**
   Create a `.env` file in the `Frontend` directory and add the following environment variables. Replace the placeholder with your actual backend API URL.
   ```
   VITE_BACKEND_URL=http://localhost:8000/api/v1
   ```

#### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Backend

### Project Description

VideoHub Backend is the server-side application that powers the VideoHub platform. It provides a robust and scalable API for managing user authentication, video uploads, video streaming, user interactions, and data storage. Built with Node.js and Express, it interacts with a MongoDB database to handle all persistent data.

### Features

- **User Management**: API endpoints for user registration, login, logout, and profile management.
- **Video Management**: Secure endpoints for uploading, retrieving, updating, and deleting video content.
- **Authentication & Authorization**: JWT-based authentication for secure API access.
- **File Uploads**: Handles video and thumbnail file uploads to cloud storage (e.g., Cloudinary).
- **Database Integration**: MongoDB for flexible and scalable data storage.
- **API Endpoints**: Comprehensive RESTful API for all frontend functionalities.
- **Error Handling**: Centralized error handling and logging.

### Advanced Implementation Details

- **State Management with Redux Toolkit**: Utilizes Redux Toolkit for predictable and scalable state management across the application. Asynchronous operations (e.g., API calls) are handled using Redux Thunks, ensuring a clean separation of concerns and maintainable data flow.
- **Optimized Rendering with React.memo and useCallback**: Components are optimized for performance using `React.memo` to prevent unnecessary re-renders and `useCallback` to memoize functions passed to child components, reducing computational overhead.
- **Responsive Design with Tailwind CSS**: Implemented a mobile-first responsive design approach using Tailwind CSS utility classes, ensuring a consistent and adaptive user experience across various devices and screen sizes.
- **Efficient Data Fetching with Axios Interceptors**: Axios is configured with interceptors to automatically handle common tasks such as attaching authentication tokens to outgoing requests and refreshing expired tokens, streamlining API interactions and improving security.

### Advanced Implementation Details

- **Robust Authentication with JWT and Cookie-based Storage**: Implemented a secure authentication system using JSON Web Tokens (JWTs) with both access and refresh tokens. Refresh tokens are stored in secure, HTTP-only cookies to mitigate XSS attacks, enhancing overall security.
- **Cloud-based Media Management with Cloudinary**: Integrated Cloudinary for efficient and scalable storage and delivery of video and image files. This offloads media handling from the server, improving performance and reliability.
- **Centralized Error Handling and Asynchronous Error Wrapping**: Developed a centralized error handling middleware to catch and process errors consistently across the application. Asynchronous route handlers are wrapped to ensure that any unhandled promise rejections are caught and passed to the error handling middleware, preventing server crashes.
- **Database Abstraction with Mongoose Schemas and Models**: Utilized Mongoose to define clear schemas and models for MongoDB, providing a robust and organized way to interact with the database. This includes data validation, pre-save hooks for password hashing, and efficient querying.
- **API Rate Limiting and Security Headers**: Implemented rate limiting on API endpoints to prevent abuse and brute-force attacks. Additionally, various security headers are configured to protect against common web vulnerabilities.

### Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Cloudinary**: For cloud-based media management (video and image storage).
- **Bcrypt**: For password hashing.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **Cookie-parser**: Middleware to parse Cookie headers and populate `req.cookies`.

### Setup Instructions

Follow these steps to get the VideoHub Backend up and running on your local machine.

#### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- MongoDB (local installation or cloud service like MongoDB Atlas)
- Cloudinary account

#### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd VideoHub/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file:**
   Create a `.env` file in the `backend` directory and add the following environment variables. Replace the placeholders with your actual credentials and configurations.

   ```
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/videohub
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **Note:** For `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`, use strong, randomly generated strings.

#### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The backend server will run on the port specified in your `.env` file (default: `8000`).

### API Endpoints

The API documentation (e.g., using Swagger/Postman collection) will be provided separately or can be generated from the codebase. Key endpoint categories include:

- `/api/v1/users`: User authentication and profile management.
- `/api/v1/videos`: Video upload, retrieval, and management.
- `/api/v1/comments`: Commenting on videos.
- `/api/v1/subscriptions`: Managing channel subscriptions.

## Contributing

We welcome contributions to the VideoHub project! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details. (Note: You might need to create a `LICENSE` file if it doesn't exist).

## Contact

For any questions or inquiries, please contact .