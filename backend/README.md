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
- Authentication
  - POST /api/v1/auth/signup
  - POST /api/v1/auth/signin
  - POST /api/v1/auth/signout
  - GET /api/v1/auth/refresh
- User
  - GET /api/v1/user/:username/profile
  - GET /api/v1/user/:username/profile/summary
  - GET /api/v1/user/:username/followers
  - GET /api/v1/user/:username/following
  - GET /api/v1/user/:username/posts
  <br><br>**(Requires authentication)**
  - GET /api/v1/user/:username/isFollowedByUser
  - GET /api/v1/user/:username/isFollowingUser
  - GET /api/v1/user/:username/chats
  - GET /api/v1/user/:username/unreadChats
  - GET /api/v1/user/:username/likedPosts
  - GET /api/v1/user/:username/suggestions
  - POST /api/v1/user/:username/follow
  - POST /api/v1/user/:username/unfollow
- Chat
  - GET /api/v1/chat/:chatId
  - GET /api/v1/chat/preview/:chatId
  - POST /api/v1/chat/create
- Post
  - GET /api/v1/post
  - GET /api/v1/post/:postId
  - GET /api/v1/post/:postId/comments
  - POST /api/v1/post
  - POST /api/v1/post/:postId/like
  - POST /api/v1/post/:postId/comment
  - DELETE /api/v1/post/:postId
  - DELETE /api/v1/post/:postId/like
  - PUT /api/v1/post/:postId
- Comment
  - GET /api/v1/comment/:commentId/replies
  - POST /api/v1/comment/:commentId/reply
  - POST /api/v1/comment/:commentId/like
  - DELETE /api/v1/comment/:commentId
  - DELETE /api/v1/comment/:commentId/like
- Search
  - GET /api/v1/search?query=<query>&searchFor=<searchFor>&take=<take>&skip=<skip>
- Misc
  - GET /api/v1/isUsernameAvailable?username=<username>
  - GET /health

## Error Handling

- **400 Bad Request**: The request could not be understood or was missing required parameters.
- **401 Unauthorized**: Authentication failed or user does not have permissions for the desired action.
- **403 Forbidden**: The user does not have permission to access the requested resource.
- **404 Not Found**: The requested resource could not be found.
- **409 Conflict**: There already exists a resource with the same identifier.
- **500 Internal Server Error**: An error occurred on the server.
