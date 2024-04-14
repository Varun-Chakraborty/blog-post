# Blog Post App
The Blog Post App is a dynamic and user-friendly blogging platform built using React for the front-end and Appwrite for the backend. It empowers users to create, manage, and interact with blog posts in an intuitive and efficient manner.

Let’s dive into the details of this app:

## Installation
To run the Blog Post App locally, follow these steps:
1. Clone the Repository:
     ```bash
      git clone https://github.com/Varun-Chakraborty/blog-post
      cd blog-post-app
     ```

2. Install Dependencies:
     ```bash
     npm install
     ```

3. Set Up Environment Variables:
   - Create a .env file in the root directory.
   Add the necessary environment variables as specified in [.env.sample](/.env.sample).

4. Start the Development Server:
    ```
    npm start
    ```

5. Access the App: Open your browser and navigate to http://localhost:5173.

## Features
### 1. User Authentication:
   - Users can register, log in, and securely authenticate themselves.
   - Only authorized users can create, edit, and delete blog posts.
### 2. Blog Creation and Editing:
   - Each blog post includes the following components:
      - Title: A descriptive title for the blog.
      - Slug: A programmatically generated unique identifier for the blog (which will be used in URLs currently IDs are used).
      - Content: The main body of the blog edited using [TinyMCE](#technologies-used).
      - Optional Image: Users can upload an image to use as a cover for their blog post.
### 3. Card-Based Display:
   - The home page showcases all existing blog posts in a visually appealing card format.
   - Only the user who created a specific blog post can edit or delete it.
### 4. Individual Post Page:
   - Clicking on a card opens a dedicated page for the selected blog post.
   - On this page:
      - The creator of the post can edit or delete it.
      - Other users can like, comment, reply to comments, and share the post (share feature to be implemented).
## Planned Features
### 1. Follow Functionality:
   - Users can follow other bloggers to receive updates on their posts.
### 2. Followings Page:
   - A page where users can view the blogs of the creators they follow.
### 3. Code Modularity:
   - Enhance code organization and maintainability by making it more modular.
## Technologies Used
### 1. Front-end:
   - [**React**](https://github.com/facebook/react): A powerful JavaScript library for building user interfaces.
   - [**Tailwind CSS**](https://github.com/tailwindlabs/tailwindcss): A utility-first CSS framework for responsive and efficient styling.
   - [**TinyMCE**](https://github.com/tinymce/tinymce-react) : A feature-rich text editor for creating and formatting blog content.
### 2. Back-end:
   - [**Appwrite**](https://github.com/appwrite/appwrite): A backend-as-a-service platform that provides authentication, database, and storage services.

By combining these technologies, the Blog Post App delivers a seamless experience for bloggers and readers alike. Feel free to explore, create, and share your thoughts! 📝🚀

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
- The Blog Post App is released under the MIT License. You can find the full license text in the [LICENSE](https://github.com/Varun-Chakraborty/blog-post/blob/main/LICENSE) file.