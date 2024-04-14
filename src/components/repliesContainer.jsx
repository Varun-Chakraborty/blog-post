import { MdSend } from "react-icons/md";
import { Button, InputField, Replies } from ".";
import { useForm } from "react-hook-form";
import { post_service } from "../appwriteServices";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function RepliesContainer({ className, commentId, repliesState, setRepliesState }) {
    const [uploading, setIfUploading] = useState(false);
    const user = useSelector(state => state.users.userInfo);
    const { register, handleSubmit, setValue } = useForm();
    const getReplies = async () => {
        setRepliesState(await post_service.getReplies(commentId));   
    }
    const createReply = async data => {
        setIfUploading(true);
        try {
            await post_service.createReply(data.reply, commentId, user.$id, user.name);
            await getReplies();
            setValue('reply', '');
        } catch (error) {
            toast.error("Can't post this reply");
            console.error(error);
        } finally {
            setIfUploading(false);
        }
    }
    return (
        <div className={`space-y-2 pl-6 pt-2 ${className}`}>
            <form
                onSubmit={handleSubmit(createReply)}
                className="flex items-center gap-2">
                <InputField
                    {...register('reply', {required: true})}
                    placeholder='Reply...' />
                <Button
                    type="submit"
                    className={"hover:bg-slate-600 " + (uploading && 'text-blue-600 dark:text-blue-500')}>
                    <MdSend />
                </Button>
            </form>
            {repliesState?.map(reply => <Replies getReplies={getReplies} key={reply.$id} {...reply} />)}
        </div>
    );
}