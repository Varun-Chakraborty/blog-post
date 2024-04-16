import { LikeButton, ShrinkedDeleteButton, ShrinkedEditButton } from ".";
import { post_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";

/**
 * A single reply component
 * @param {object} props
 * @param {string} props.$id - The reply's ID
 * @param {string} props.userId - The user's ID who created the reply
 * @param {string} props.username - The user's username who created the reply
 * @param {string} props.msg - The reply's message
 * @param {function} props.getReplies - The function to get the updated array of replies
 * @param {array} [props.likes=[]] - The likes array
 * @returns {ReactElement} Reply component
 */
export default function Replies({ $id, userId, username, msg, getReplies, likes = [] }) {
    const user = useSelector(state => state.users.userInfo);
    const [processing, setIfProcessing] = useState(false);

    /**
     * Deletes a reply and gets the updated replies
     */
    const deleteReplyHandler = async () => {
        setIfProcessing(true);
        try {
            await post_service.deleteReply($id);
            await getReplies();
            toast.success('Reply Deleted');
        } catch (error) {
            toast.error("Can't delete the reply");
            console.error(error);
        } finally {
            setIfProcessing(false);
        }
    };

    return (
        <div className="py-2 flex justify-between items-center border-b border-black dark:border-white">
            <div className="flex items-center gap-2">
                <div className="h-6 aspect-square rounded-full bg-blue-300 text-black flex justify-center items-center">{username.charAt(0).toUpperCase()}</div>
                <div>
                    <div className="text-xs">{'@' + username}</div>
                    <div>{msg}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <LikeButton likes={likes} id={$id} />
                {user.$id === userId && (
                    <>
                        <ShrinkedEditButton />
                        <ShrinkedDeleteButton processing={processing} onClick={deleteReplyHandler} />
                    </>
                )}
            </div>
        </div>
    );
}
