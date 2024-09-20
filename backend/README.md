# BACKEND FOR FULL-STACK BLOGPOST

This is the part of full-stack BlogPost, backend is hosted on render.com

## Table of Contents

- [Installation](#installation)
- [API Documentation](#api-documentation)
  - [Usage](#usage)
  - [BASE URL](#base-url)
  - [RESPONSE FORMAT](#response-format)
  - [Endpoints](#endpoints)
- [Error Handling](#error-handling)

## Installation

### Prerequisites

- Node.js
- NPM (or any other package manager, you prefer, but you would need to change the installation command)
- A postgres database, if you prefer other sql based databases, you would need to change it in the prisma schema file, a no sql database is not supported.

### Installation steps

To run the Blog Post backend locally, follow these steps:

1. Install Dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Set Up Environment Variables:

   - Create a .env file in the root directory.
   - Add the necessary environment variables as specified in .env.sample.

3. Start the Development Server:

   ```bash
   npm run dev
   ```

4. Access the API: API could be accessed at http://localhost:3000 (3000 is the default port for the backend, you can change it in the .env file).

## API Documentation

### Usage

- Softwares like Postman can be used to test the API.
- Or just run the [frontend](../frontend/) locally and run the API server to test the API, just remember to put the local frontend url in the .env file.

### BASE URL

- /api/v1 is the base URL for all the API endpoints.

### RESPONSE FORMAT

- The response format is JSON.
- In times of success:
  ```json
  {
    "status": 200, // codes will range between [200, 299] for success
    "success": true,
    "message": "Request handled successfully.",
    "data": {}
  }
  ```
  **_NOTE: The data field will contain the response data. And depending upon the endpoint, the data may not be present._**

- In times of error:
  ```json
  {
    "status": 500, // codes will range between [400, 500] for error
    "success": false,
    "message": "Request failed.",
    "error": {}
  }
  ```

### Endpoints

#### 1. GET /api/v1/isUsernameAvailable

- **Purpose**
  This endpoint is used to check if a username is available.
- **Request**
  - **Method**: GET
  - **URL**: `/api/v1/isUsernameAvailable`
  - **Headers**:
    - `Content-Type: application/json`
  - **Query Parameters**:
    - `username` _(string, required)_: The username to check.
- **Response:**
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Username is available."
  }
  ```

#### 2. GET /api/v1/search

- **Purpose**
  This endpoint is used to search for posts.
- **Request**
  - **Method**: GET
  - **URL**: `/api/v1/search`
  - **Headers**:
    - `Content-Type: application/json`
  - **Query Parameters**:
    - `query` _(string, required)_: The search query.
- **Response:**
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Search results retrieved successfully.",
    "data": {
      "query": "exampleQuery",
      "searchResult": {
          users: [
              {
                  id: /* userId */,
                  username: "exampleUser",
                  email: "exampleEmail"
              }
          ],
      }
    }
  }
  ```
  **_NOTE: Yet to implement post search._**

#### 3. POST /api/v1/auth/signup

- **Purpose**
  This endpoint is used to create a new user.
- **Request**
  - **Method**: POST
  - **URL**: `/api/v1/auth/signup`
  - **Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    - `username` _(string, required)_: The user's username.
    - `name` _(string, required)_: The user's name.
    - `email` _(string, required)_: The user's email.
    - `password` _(string, required)_: The user's password.
- **Example Request Body:**
  ```json
  {
    "username": "exampleUser",
    "name": "exampleName",
    "email": "exampleEmail",
    "password": "examplePassword"
  }
  ```
- **Response:**
  ```json
  {
    "status": 201,
    "success": true,
    "message": "User created successfully.",
    "data": {
      "user": {
        "id": /* userId */,
        "username": "exampleUser",
        "email": "exampleEmail",
        "name": "exampleName",
      },
      "accessToken": "exampleAccessToken"
    }
  }
  ```

#### 4. POST /api/v1/auth/signin

- **Purpose**
  This endpoint authenticates a user with their `username` and `password`. If the credentials are valid, the user is signed in and an access token is returned.
- **Request**

  - **Method**: POST
  - **URL**: `/api/v1/auth/signin`
  - **Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    - `username` _(string, required)_: The user's username.
    - `password` _(string, required)_: The user's password.

- **Example Request Body:**
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```
- **Response:**
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {
        "id": /* userId */,
        "username": "exampleUser",
        "email": "exampleEmail",
        "name": "exampleName",
      },
      "accessToken": "exampleAccessToken"
    }
  }
  ```

#### 5. GET /api/v1/auth/refresh

- **Purpose**
  This endpoint is used to refresh the access token.
- **Request**
  - **Method**: GET
  - **URL**: `/api/v1/auth/refresh`
  - **Headers**:
    - `Content-Type: application/json`
  - **Response:**
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Access token refreshed.",
    "data": {
      "accessToken": "exampleAccessToken"
    }
  }

#### 6. POST /api/v1/auth/signout`

- **Purpose**
  This endpoint is used to sign out a user.
- **Request**
  - **Method**: POST
  - **URL**: `/api/v1/auth/signout`
  - **Headers**:
    - `Content-Type: application/json`
  - **Response:**
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Logout successful."
  }
  ```

#### 7. GET /api/v1/user/profile

- **Purpose**
  This endpoint is used to get the profile of a user.
- **Request**
  - **Method**: GET
  - **URL**: `/api/v1/user/profile`
  - **Headers**:
    - `Content-Type: application/json`
  - **Response:**
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Profile retrieved successfully.",
    "data": {
      "user": {
        "id": /* userId */,
        "username": "exampleUser",
        "email": "exampleEmail",
        "name": "exampleName",
      }
    }
  }
  ```
  **_NOTE: Yet to implement profile of other users._**

## Error Handling

- **400 Bad Request**: The request could not be understood or was missing required parameters.
- **401 Unauthorized**: Authentication failed or user does not have permissions for the desired action.
- **403 Forbidden**: The user does not have permission to access the requested resource.
- **404 Not Found**: The requested resource could not be found.
- **409 Conflict**: There already exists a resource with the same identifier.
- **500 Internal Server Error**: An error occurred on the server.
