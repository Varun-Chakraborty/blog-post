import { PostForm } from "../components";

/**
 * The create posts page component
 * @returns {JSX.Element} The create posts page component
 */
export default function CreatePosts() {
    // Returns the create posts page component
    return (
        <main
            className="min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white">
            {/* The post form component */}
            <PostForm />
        </main>
    );
}
