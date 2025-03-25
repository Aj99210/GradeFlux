# GradeFlux Backend

This is the backend server for GradeFlux, built with Node.js and Express.

## Setup Instructions

1. Make sure you have Node.js installed (v14+ recommended)

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

4. The server will run on http://localhost:8080

## API Endpoints

- `GET /` - Check if API is running
- `GET /api/courses` - Get list of courses
- `GET /api/courses/:courseId/assignments` - Get assignments for a course
- `GET /api/courses/:courseId/assignments/:assignmentId/submissions` - Get submissions for an assignment
- `POST /api/courses/:courseId/assignments/:assignmentId/sync` - Sync grades back to Google Classroom

## Authentication

All API endpoints require an Authorization header with a valid token.

For testing, any non-empty string will work as a token.

## Mock Data

This implementation uses mock data for testing purposes. In a production environment, it would connect to the Google Classroom API. 