import { useSearchParams } from "react-router-dom";
import { Loader, PostForm } from "../components";
import { useSelector } from "react-redux";

/**
 * Component to edit a post.
 *
 * @returns {JSX.Element} EditPost component.
 */
export default function EditPost() {
    // Use search params to get post id
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    // Use redux to get post from store
    const data = useSelector(state => state.posts.posts.filter(post => post.$id === id)[0]);

    // Render component
    return (
        <main
            className={"min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white p-2 "}>
            {/* If post exists, render PostForm component with post data,
                otherwise render Loader component */}
            {data ? <PostForm data={data} /> : <Loader />}
        </main>
    );
}
