import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Button, CommentButton, CommentContainer, DeleteButton, EditButton, LikeButton, Loader, ShareButton, ShrinkedDeleteButton, ShrinkedEditButton
} from "../components";
import parse from 'html-react-parser';
import { usePosts } from "../hooks";
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from "react-icons/md";
import { useSelector } from "react-redux";


/**
 * Component to show a single post
 * @returns {ReactElement} Component for showing a single post
 */
export default function ShowPost() {
    // Select user info from redux store
    const user = useSelector(state => state.users.userInfo);
    // Get search params from URL
    const [searchParams] = useSearchParams();
    // Get post id from search params
    const id = searchParams.get('id');
    // Find post in redux store by id
    const post = useSelector(state => state.posts.posts.filter(post => post.$id === id)[0]);
    // Destructure post data
    const {
        imgURL, userId, username, title, content, comments
    } = post;

    // State to show/hide comments
    const [showComments, setShowComments] = useState(true);
    // State to store comments from database
    const [commentsState, setCommentsState] = useState(null);
    // State to show processing state of delete button
    const [processing, setIfProcessing] = useState(false);
    // Get navigate function from react-router-dom
    const navigate = useNavigate();
    // Sync comments from redux store with commentsState
    useEffect(() => { post && setCommentsState(comments) }, []);
    // Get deletePost function from usePosts hook
    const { deletePost } = usePosts();
    return (
        <main
            className={"min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white pt-2"}>
            {/* Render post if it exists, otherwise render loader */}
            {post ? (
                <>
                    {/* Header with back button and edit/delete buttons */}
                    <div className="flex justify-between px-2 pb-5">
                        <Button
                            onClick={() => navigate('..')}
                            className="hover:bg-slate-300 dark:hover:bg-slate-700"><MdArrowBackIosNew /></Button>
                        {/* If user is owner of the post, render edit and delete buttons */}
                        {user.$id===userId && (
                            <div className="flex gap-2 text-white">
                                <EditButton
                                    className='hidden sm:block'
                                    onClick={() => navigate(`/posts/edit?id=${id}`)} />
                                <ShrinkedEditButton
                                    className='sm:hidden'
                                    onClick={() => navigate(`/posts/edit?id=${id}`)} />
                                <DeleteButton
                                    className='hidden sm:block'
                                    {...(processing && { processing: true })}
                                    onClick={async () => {
                                        setIfProcessing(true);
                                        await deletePost(id).then(() => navigate('..'))
                                        setIfProcessing(false);
                                    }} />
                                <ShrinkedDeleteButton
                                    {...(processing && { processing: true })}
                                    className='sm:hidden'
                                    onClick={async () => {
                                        setIfProcessing(true);
                                        await deletePost(id)
                                        navigate('..');
                                        setIfProcessing(false);
                                    }} />
                            </div>
                        )}
                    </div>
                    {/* Post content */}
                    <div className="flex flex-col items-center text-center gap-3">
                        {imgURL && (
                            <div className="bg-black h-48 w-96 rounded-2xl">
                                <img className="h-full w-full object-cover object-top rounded-2xl" src={imgURL} alt="" />
                            </div>
                        )}
                        <div>
                            {title}
                        </div>
                        <div>
                            {parse(content)}
                        </div>
                    </div>
                    <div className="flex justify-end px-2 italic">
                        Posted by @{username}
                    </div>
                    <div className="flex justify-center gap-10 p-2">
                        <LikeButton count={0} />
                        <CommentButton onClick={() => setShowComments(prev => !prev)} count={commentsState?.length} />
                        <ShareButton count={0} />
                    </div>
                    <CommentContainer
                        postId={id}
                        commentsState={commentsState}
                        setCommentsState={setCommentsState}
                        className={"transition-all origin-top " + (showComments ? "scale-y-100" : "scale-y-0 w-0")} />
                </>
            ) : <Loader />}
        </main>
    );
}
