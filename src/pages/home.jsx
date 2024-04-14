import { useSelector } from "react-redux";
import { post_service } from "../appwriteServices";
import { useEffect } from "react";
import { Button, Card, Loader } from "../components";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { postActions } from "../redux/slices";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const loggedIn = useSelector(state => state.users.loggedIn);
    const posts = useSelector(state => state.posts.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        loggedIn && post_service
            .getPosts()
            .then(post => dispatch(postActions.getPosts(post)))
            .catch(error => {
                toast.error("Can't fetch the posts");
                console.error(error);
            });
    }, [loggedIn]);

    return (
        <main
            className={"min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white p-2 "
                + (loggedIn && posts?.length && "grid auto-rows-[300px] lg:grid-cols-4 md:grid-cols-3 min-[400px]:grid-cols-2 grid-cols-1  gap-3 ")}>
            {
                loggedIn ?
                    posts ?
                        posts.length ?
                            posts.map(post => <Card key={post.$id} {...post} />) :
                            <div className="h-full flex justify-center items-center font-bold font-serif uppercase">No posts yet</div> :
                        <Loader /> :
                    <div className="h-full flex justify-center items-center font-bold font-serif uppercase">Login to view posts</div>
            }
            <Button
                className="sm:hidden bg-gray-400 dark:bg-gray-600 fixed bottom-7 right-5"
                onClick={evnt => {
                    evnt.stopPropagation();
                    navigate('/create-post');
                }} >
                <MdAdd />
            </Button>
        </main>
    );
}