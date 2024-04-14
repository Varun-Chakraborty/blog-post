import { useEffect, useState } from "react";
import { CommentButton, LikeButton, ReplyContainer, ShrinkedDeleteButton, ShrinkedEditButton } from ".";
import parse from 'html-react-parser';
import { post_service } from "../appwriteServices";
import { toast } from "react-toastify";

export default function Comments({ $id, name, msg, pfp, replies=[], edit=true, getComments, likes = [] }) {
    const [showReplies, setShowReplies] = useState(false);
    const [repliesState, setRepliesState] = useState(null);
    const [processing, setIfProcessing] = useState(false);
    useEffect(() => { setRepliesState(replies) }, []);
    return (
        <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg">
            <div className="flex justify-between items-center border-b border-black dark:border-white py-2">
                <div className="flex items-center gap-2">
                    {parse(pfp)}
                    <div>
                        <div className="text-xs">{'@' + name}</div>
                        <div>{msg}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <LikeButton likes={likes} />
                    <CommentButton onClick={() => setShowReplies(prev => !prev)} count={repliesState?.length} />
                    {edit && (
                        <>
                            <ShrinkedEditButton />
                            <ShrinkedDeleteButton {...(processing && { processing: true })} onClick={async () => {
                                setIfProcessing(true);
                                try {
                                    await post_service.deleteComment($id);
                                    await getComments();
                                    toast.success('Comment Deleted');
                                } catch (error) {
                                    toast.error("Can't delete the comment");
                                    console.error(error);
                                } finally {
                                    setIfProcessing(false);
                                }
                            }} />
                        </>
                    )}
                </div>
            </div>
            <ReplyContainer
                commentId={$id}
                repliesState={repliesState}
                setRepliesState={setRepliesState}
                className={"transition-all origin-top " + (showReplies ? "scale-y-100" : "scale-y-0 h-0")} />
        </div>
    );
}