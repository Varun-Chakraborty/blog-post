import { LikeButton, ShrinkedDeleteButton, ShrinkedEditButton } from ".";
import { post_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Replies({ $id, userId, username, msg, getReplies, likes = [] }) {
    const user = useSelector(state => state.users.userInfo);
    const [processing, setIfProcessing] = useState(false);
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
                        <ShrinkedDeleteButton {...(processing && { processing: true })} onClick={async () => {
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
                        }} />
                    </>
                )}
            </div>
        </div>
    );
}