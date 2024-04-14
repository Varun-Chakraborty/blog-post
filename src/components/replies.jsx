import { LikeButton, ShrinkedDeleteButton, ShrinkedEditButton } from ".";
import parse from 'html-react-parser';
import { post_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Replies({ $id, name, msg, pfp, edit = true, getReplies, likes = [] }) {
    const [processing, setIfProcessing] = useState(false);
    return (
        <div className="py-2 flex justify-between items-center border-b border-black dark:border-white">
            <div className="flex items-center gap-2">
                {parse(pfp)}
                <div>
                    <div className="text-xs">{'@' + name}</div>
                    <div>{msg}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <LikeButton likes={likes} id={$id} />
                {edit && (
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