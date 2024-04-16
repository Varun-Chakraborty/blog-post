import { MdSend } from "react-icons/md";
import { Button, InputField, Replies } from ".";
import { useForm } from "react-hook-form";
import { post_service } from "../appwriteServices";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

/**
 * Component to render the replies of a comment
 * 
 * @param {object} props
 * @param {string} props.className className to be applied to the component
 * @param {string} props.commentId ID of the comment
 * @param {array} props.repliesState replies of the comment
 * @param {function} props.setRepliesState function to update the replies state
 * @returns {JSX.Element} RepliesContainer component
 */
export default function RepliesContainer({ className, commentId, repliesState, setRepliesState }) {
    // Whether the user is uploading a reply
    const [uploading, setIfUploading] = useState(false);
    // Current user
    const user = useSelector(state => state.users.userInfo);
    // Form hook
    const { register, handleSubmit, setValue } = useForm();

    /**
     * Get the replies of a comment from the API and update the repliesState
     */
    const getReplies = async () => {
        setRepliesState(await post_service.getReplies(commentId));
    }

    /**
     * Create a reply and then get the replies again
     * @param {object} data form data
     */
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
                    {...register('reply', { required: true })}
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
