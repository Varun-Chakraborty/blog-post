import { useEffect, useState } from "react";
import { CommentButton, LikeButton, ReplyContainer, ShrinkedDeleteButton, ShrinkedEditButton } from ".";
import { post_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

/**
 * Comment component
 * @param {string} $id The comment's ID
 * @param {string} username The comment's username
 * @param {string} userId The comment's user ID
 * @param {string} msg The comment's message
 * @param {Array} replies The comment's replies
 * @param {Function} getComments Function to get the comments
 * @param {Array} likes The comment's likes
 * @returns The comment component
 */
export default function Comments({ $id, username, userId, msg, replies = [], getComments, likes = [] }) {
    const user = useSelector(state => state.users.userInfo);
    const [showReplies, setShowReplies] = useState(false);
    const [repliesState, setRepliesState] = useState(null);
    const [processing, setIfProcessing] = useState(false);
    useEffect(() => { setRepliesState(replies); }, []);
    return (
        <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg">
            <div className="flex justify-between items-center border-b border-black dark:border-white py-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 aspect-square rounded-full bg-blue-300 text-black flex justify-center items-center">{ username.charAt(0).toUpperCase() }</div>
                    <div>
                        <div className="text-xs">{'@' + username}</div>
                        <div>{msg}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <LikeButton likes={likes} />
                    <CommentButton onClick={() => setShowReplies(prev => !prev)} count={repliesState?.length} />
                    {user.$id === userId && (
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
