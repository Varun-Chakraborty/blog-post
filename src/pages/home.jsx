import { useSelector } from "react-redux";
import { post_service } from "../appwriteServices";
import { useEffect } from "react";
import { Button, Card, Loader } from "../components";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { postActions } from "../redux/slices";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

/**
 * The Home page of the app
 * @returns {ReactElement} The home page
 */
export default function Home() {
    const loggedIn = useSelector(state => state.users.loggedIn); // Whether user is logged in or not
    const posts = useSelector(state => state.posts.posts); // The posts of the user if logged in
    const dispatch = useDispatch(); // The redux dispatch function
    const navigate = useNavigate(); // The function to navigate to a new route

    useEffect(() => {
        /**
         * Fetch posts from the server only if the user is logged in
         */
        loggedIn && post_service
            .getPosts()
            .then(post => dispatch(postActions.getPosts(post))) // Dispatch action to update the posts in the redux store
            .catch(error => {
                toast.error("Can't fetch the posts"); // Show toast with error message
                console.error(error); // Log the error to the console
            });
    }, [loggedIn]); // Run the effect only if the loggedIn value changes

    return (
        <main
            className={`min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white p-2 `
                + (loggedIn && posts?.length && "grid auto-rows-[300px] lg:grid-cols-4 md:grid-cols-3 min-[400px]:grid-cols-2 grid-cols-1  gap-3 ")}>
            {
                loggedIn ?
                    posts ?
                        posts.length ?
                            posts.map(post => <Card key={post.$id} {...post} />) : // Map the posts to Card components
                            <div className="h-full flex justify-center items-center font-bold font-serif uppercase">No posts yet</div> :
                        <Loader /> : // Show loader if posts are null
                    <div className="space-y-5">
                        <div>DON'T PUT YOUR PERSONAL INFO IN ANY FORMS YOU SEE IN THIS SITE, AS THERE NO GUARANTEE OF PROTECTION OF YOUR DATA</div>
                        <div className="h-full flex justify-center items-center font-bold font-serif uppercase">Login to view posts</div>
                    </div>
            }
            <Button
                className="sm:hidden bg-gray-400 dark:bg-gray-600 fixed bottom-7 right-5"
                onClick={evnt => {
                    evnt.stopPropagation();
                    navigate('/create-post'); // Navigate to create post page
                }} >
                <MdAdd />
            </Button>
        </main>
    );
}
