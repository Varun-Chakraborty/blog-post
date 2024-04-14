import { MdSend } from "react-icons/md";
import { Button, Comments, InputField } from ".";
import { useForm } from "react-hook-form";
import { post_service } from "../appwriteServices";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function CommentContainer({ className, postId, commentsState, setCommentsState }) {
    const [uploading, setIfUploading] = useState(false);
    const user = useSelector(state => state.users.userInfo);
    const { register, handleSubmit, setValue } = useForm();
    const getComments = async () => {
        setCommentsState(await post_service.getComments(postId));
    }
    const createComment = async data => {
        setIfUploading(true);
        try {
            await post_service.createComment(data.comment, postId, user.$id, user.name);
            await getComments();
            setValue('comment', '');
        } catch (error) {
            toast.error("Can't post this comment");
            console.error(error);
        } finally {
            setIfUploading(false);
        }
    }
    return (
        <div id="comments" className={`bg-slate-300 dark:bg-slate-900 py-2 space-y-2 ${className}`}>
            <div className="px-2">
                <strong>Comments</strong>
            </div>
            <div className="space-y-2 px-4">
                <form
                    onSubmit={handleSubmit(createComment)}
                    className="flex items-center gap-2">
                    <InputField
                        {...register('comment', {required: true})}
                        placeholder='Comment...' />
                    <Button type="submit" className={"hover:bg-slate-600 " + (uploading && ('text-blue-600 dark:text-blue-500'))}>
                        <MdSend />
                    </Button>
                </form>
                {commentsState?.map(comment => <Comments getComments={getComments} key={comment.$id} {...comment} />)}
            </div>
        </div>
    );
}