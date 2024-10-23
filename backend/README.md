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

- [Node.js](https://nodejs.org/en/)
- NPM (or any other package manager, you prefer, but you would need to change the installation command)
- docker cli **(or docker desktop)**
- docker-compose **(or docker desktop)**

### Steps to set up the backend

- [For development of backend](#for-development-of-backend)
- [For using api to develop frontend](#for-using-api-to-develop-frontend)

### For development of backend

1. Set Up databases if not already:

   ```bash
   docker-compose -f /path/to/docker-compose.dev.yml up -d
   ```

2. Install Dependencies:

   ```bash
   cd backend
   npm install
   ```

  3. Set Up Environment Variables:
  - Create a .env file in the root directory.
  - Add the necessary environment variables as specified in [here](.env.sample).

  4. Migrate Database:

     ```bash
     npm run migrate
     ```

  5. Start the Development Server:

     ```bash
     npm run dev
     ```
     ```bash
     npm run dev
     ```

  6. Access the API: API could be accessed at http://localhost:3000 (3000 is the default port for the backend, you can change it in the .env file).

### For using api to develop frontend

  - Set up the enviroment variables: 
    - Create a file named .env.docker.dev
    - Add the necessary environment variables as specified in [here](.env.docker.dev.sample).

  - Set up the app and DBs on docker from [docker-compose file](docker-compose.yml):
    ```bash
    docker-compose -f /path/to/docker-compose.yml up -d
    ```
  
  - Access the api at http://localhost:4002 (4002 is the default port for the backend, you can change it in the [docker-compose file](docker-compose.yml) (line 24 and 35)).

## API Documentation

### Usage

- Softwares like Postman can be used to test the API.
- Or just run the [frontend](../frontend/) locally and run the API server to test the API, just remember to put your frontend url in the .env file or docker-compose file whatever you prefer.

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

- authentication

  - [POST /api/v1/auth/signup](#1-post-apiv1authsignup)
  - [POST /api/v1/auth/signin](#2-post-apiv1authsignin)
  - [POST /api/v1/auth/signout](#3-post-apiv1authsignout)
  - [GET /api/v1/auth/refresh](#4-get-apiv1authrefresh)

- search

  - [GET /api/v1/search](#5-get-apiv1search)

- user
  - [GET /api/v1/user/:username/profile](#6-get-apiv1userusernameprofile)

#### 1. POST /api/v1/auth/signup

- **Purpose**: Register a new user.
- **Method**: POST
- **URL**: `/api/v1/auth/signup`
- **Sample Request**:
  ```json
  {
    "username": "username",
    "name": "name",
    "email": "email",
    "password": "password"
  }
  ```
- **Sample Response**:
  ```json
  {
    "status": 201,
    "success": true,
    "message": "Signup successful.",
    "data": {
      "user": {
        "id": 1,
        "username": "username",
        "name": "name",
        "email": "email",
        "pfp": null, // we are yet to support adding pfp at the time of registration
        "role": "USER"
      },
      "accessToken": "accessToken"
    }
  }
  ```

#### 2. POST /api/v1/auth/signin

- **Purpose**: Sign in a user.
- **Method**: POST
- **URL**: `/api/v1/auth/signin`
- **Sample Request**:
  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```
- **Sample Response**:
- **Sample Response**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Signin successful.",
    "data": {
      "user": {
        "id": 1,
        "username": "username",
        "name": "name",
        "email": "email",
        "pfp": null,
        "role": "USER"
      },
      "accessToken": "accessToken"
      "accessToken": "accessToken"
    }
  }
  ```

#### 3. POST /api/v1/auth/signout

- **Purpose**: Sign out a user.
- **Method**: POST
- **URL**: `/api/v1/auth/signout`
- **Required Parameters**:
  - the `accessToken` of the user either from the cookie as set by the server or from the `Authorization` header
- **Sample Request Header**:
  ```json
  {
    "Authorization": "Bearer accessToken"
  }
  ```
- **Sample Response**:
- **Sample Response**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Signout successful."
  }
  ```

#### 4. GET /api/v1/auth/refresh

- **Purpose**: Refresh the access token.
- **Method**: GET
- **URL**: `/api/v1/auth/refresh`
- **Required Parameters**:
  - the `refreshToken` of the user either from the cookie as set by the server or from the `Authorization` header
- **Sample Request Header**:
  ```json
  {
    "Authorization": "Bearer refreshToken"
  }
  ```
- **Sample Response**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Refresh successful.",
    "data": {
      "accessToken": "accessToken"
    }
  }
  ```

#### 5. GET /api/v1/search

- **Purpose**: Search for users.
- **Method**: GET
- **URL**: `/api/v1/search`
- **Required Parameters**:
  - the `q` of the search query
  - the `searchFor` of the search query
  - the `skipTill` of the search query
- **Sample Request**:
  `/api/v1/search?q=query&searchFor=users&skipTill=10`
- **Sample Response**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Search successful.",
    "data": {
      "searchResult": [
        {
          "id": 1,
          "username": "username",
          "name": "name",
          "email": "email",
          "pfp": null,
          "role": "USER"
        },
        {
          "id": 2,
          "username": "username",
          "name": "name",
          "email": "email",
          "pfp": null,
          "role": "USER"
        }
      ]
    }
  }
  ```

#### 6. GET /api/v1/user/:username/profile

- **Purpose**: Get the profile of a user.
- **Method**: GET
- **URL**: `/api/v1/user/:username/profile`
- **Required Parameters**:

  - the `username` of the user

  **_Note: The `username` supports a special keyword `me` which will return the profile of the currently logged in user, if user is not logged in it will return [401](#error-handling) error._**

- **Sample Request**:
  `/api/v1/user/username/profile`
- **Sample Response**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "User found.",
    "message": "User found.",
    "data": {
      "user": {
        "id": 1,
        "username": "username",
        "name": "name",
        "email": "email",
        "pfp": null,
        "role": "USER"
        "id": 1,
        "username": "username",
        "name": "name",
        "email": "email",
        "pfp": null,
        "role": "USER"
      }
    }
  }
  ```

## Error Handling

- **400 Bad Request**: The request could not be understood or was missing required parameters.
- **401 Unauthorized**: Authentication failed or user does not have permissions for the desired action.
- **403 Forbidden**: The user does not have permission to access the requested resource.
- **404 Not Found**: The requested resource could not be found.
- **409 Conflict**: There already exists a resource with the same identifier.
- **500 Internal Server Error**: An error occurred on the server.
