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


export default function ShowPost() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const post = useSelector(state => state.posts.posts.filter(post => post.$id === id)[0]);
    const { edit, imgURL, title, content, comments } = post;

    const [showComments, setShowComments] = useState(true);
    const [commentsState, setCommentsState] = useState(null);
    const [processing, setIfProcessing] = useState(false);
    const navigate = useNavigate();
    useEffect(() => { post && setCommentsState(comments) }, []);
    const { deletePost } = usePosts();
    return (
        <main
            className={"min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white pt-2"}>
            {
                post ? (
                    <>
                        <div className="flex justify-between px-2 pb-5">
                            <Button
                                onClick={() => navigate('..')}
                                className="hover:bg-slate-300 dark:hover:bg-slate-700"><MdArrowBackIosNew /></Button>
                            {
                                edit && (
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
                                )
                            }
                        </div>
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
                ) : <Loader />
            }
        </main>
    );
}