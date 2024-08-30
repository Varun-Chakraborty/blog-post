# Blog Post App
The Blog Post App is a dynamic and user-friendly blogging platform built using React for the [front-end](./frontend/) and [custom API](./backend/) for the backend. It empowers users to create, manage, and interact with blog posts in an intuitive and efficient manner.

Let’s dive into the details of this app:

## Installation
To install the Blog Post App locally, follow these steps:
   1. Clone the Repository:
        ```bash
         git clone https://github.com/Varun-Chakraborty/blog-post
         cd blog-post-app
        ```

   2. Further installation is spread in two parts:
      ### For frontend
         To run the Blog Post frontend locally, follow these steps:

         1. Install Dependencies:
            ```bash
               cd frontend
               npm install
            ```

         2. Set Up Environment Variables:
            - Create a .env file in the root directory.
            Add the necessary environment variables as specified in [.env.sample](/frontend/.env.sample).

         3. Start the Development Server:
            ```bash
               npm run dev
            ```

         3. Access the App: Open your browser and navigate to http://localhost:5173.

      ### For backend
         To run the Blog Post backend locally, follow these steps:

         1. Install Dependencies:
            ```bash
               cd backend
               npm install
            ```

         2. Set Up Environment Variables:
            - Create a .env file in the root directory.
            Add the necessary environment variables as specified in [.env.sample](/backend/.env.sample).
            - You would need a postgres database to run the backend.

         3. Start the Development Server:
            ```bash
               npm run dev
            ```

         3. Access the App: Open your browser and navigate to http://localhost:3000 (3000 is the default port for the backend, you can change it in the .env file).


## Features
- ### Authentication
   The Blog Post App provides an authentication system that allows users to create, edit, and delete their own blog posts. This feature is implemented using JWT tokens.

## Contribution Guidelines
We welcome contributions from the community! If you’d like to contribute to the Blog Post App, follow these steps:

### 1. Fork the repository to your GitHub account.

### 2. Clone Your Fork:
```bash
git clone https://github.com/your-username/blog-post-app.git
cd blog-post-app
```

### 3. Create a New Branch:
```bash
git checkout -b feature/my-awesome-feature
```

### 4. Make Changes:
Implement your feature, fix a bug, or improve existing functionality.

### 5. Write clear and concise commit messages.

### 6. Test Locally:
Ensure that your changes work as expected by testing the app locally.

### 7. Push to Your Fork:
git push origin feature/my-awesome-feature

### 8. Create a Pull Request:
- Go to your fork on GitHub and create a pull request.
- Provide a detailed description of your changes.

### 9. Review and Merge:
The maintainers will review your pull request.
Once approved, your changes will be merged into the main repository.

## License
- The Blog Post App is released under the MIT License. You can find the full license text in the [LICENSE](/LICENSE) file.
