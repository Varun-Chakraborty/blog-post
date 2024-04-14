import { MdMoreVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { usePosts } from '../hooks';
import { Button, CommentButton, LikeButton, ShrinkedDeleteButton, ShrinkedEditButton } from '.';

export default function Card({ $id, title, imgURL, edit, comments }) {
    const navigate = useNavigate();
    const [processing, setIfProcessing] = useState(false);
    const { deletePost } = usePosts();
    return (
        <div
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
                        <CommentButton onClick={evnt => {
                            evnt.stopPropagation();
                            navigate(`/posts?id=${$id}#comments`);
                        }} count={comments.length} />
                        <Button onClick={evnt => evnt.stopPropagation()}
                            className='group relative hover:bg-slate-400 dark:hover:bg-slate-600'>
                            {edit && (
                                <div
                                    className="bg-slate-200 group-focus-within:flex hidden dark:bg-slate-600 absolute bottom-12 right-0 rounded-lg shadow p-2 z-50 text-white flex-col gap-2">
                                    <ShrinkedEditButton
                                        onClick={evnt => {
                                            evnt.stopPropagation();
                                            navigate(`/posts/edit?id=${$id}`);
                                        }} />
                                    <ShrinkedDeleteButton
                                        {...(processing && { processing: true })}
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