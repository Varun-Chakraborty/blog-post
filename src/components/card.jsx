import { MdMoreVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { usePosts } from '../hooks';
import { Button, CommentButton, LikeButton, ShrinkedDeleteButton, ShrinkedEditButton } from '.';
import { useSelector } from 'react-redux';

/**
 * A single post component
 * @param {object} props - The props passed to the component
 * @param {string} props.$id - The post id
 * @param {string} props.title - The post title
 * @param {string} props.userId - The post creator id
 * @param {string} props.username - The post creator name
 * @param {string} props.imgURL - The post image URL
 * @param {number} props.comments - The number of comments on the post
 */
export default function Card({ $id, title, userId, username, imgURL, comments }) {
    // Get user info from redux store
    const user = useSelector(state => state.users.userInfo);
    // Get navigate function from react-router-dom
    const navigate = useNavigate();
    // Whether the post is being deleted
    const [processing, setIfProcessing] = useState(false);
    // Get deletePost function from usePosts hook
    const { deletePost } = usePosts();

    return (
        <div
            // When clicked, navigate to the post page
            onClick={() => navigate(`/posts?id=${$id}`)}
            className="h-full w-full bg-white dark:bg-black rounded-xl flex flex-col justify-end cursor-pointer relative hover:shadow-[5px_5px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-white">
            {imgURL && (
                <img className="h-full w-full object-cover rounded-xl" src={imgURL} alt="" />
            )}
            <div className="text-white absolute bottom-0 z-50 w-full select-none">
                <div className='bg-slate-700 opacity-40 rounded-b-xl absolute top-0 left-0 w-full h-full'></div>
                <div className='relative z-50'>
                    <div className='w-full p-2'>
                        <div className="font-bold text-center">{title}</div>
                    </div>
                    <div className='flex justify-between p-1'>
                        <LikeButton count={0} />
                        <CommentButton
                            // When clicked, navigate to the comments section
                            onClick={evnt => {
                                evnt.stopPropagation();
                                navigate(`/posts?id=${$id}#comments`);
                            }}
                            // Show the number of comments on the post
                            count={comments?.length} />
                        <Button
                            // Stop event propagation to prevent navigation
                            onClick={evnt => evnt.stopPropagation()}
                            className='group relative hover:bg-slate-400 dark:hover:bg-slate-600'>
                            {user.$id === userId && (
                                <div
                                    className="bg-slate-200 group-focus-within:flex hidden dark:bg-slate-600 absolute bottom-12 right-0 rounded-lg shadow p-2 z-50 text-white flex-col gap-2">
                                    <ShrinkedEditButton
                                        // When clicked, navigate to the post edit page
                                        onClick={evnt => {
                                            evnt.stopPropagation();
                                            navigate(`/posts/edit?id=${$id}`);
                                        }} />
                                    <ShrinkedDeleteButton
                                        // Show a spinner if the post is being deleted
                                        {...(processing && { processing: true })}
                                        // When clicked, delete the post
                                        onClick={async evnt => {
                                            evnt.stopPropagation();
                                            setIfProcessing(true);
                                            await deletePost($id);
                                            setIfProcessing(false);
                                        }} />
                                </div>
                            )}
                            <MdMoreVert />
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}
