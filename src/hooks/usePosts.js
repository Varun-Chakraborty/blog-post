import { post_service } from "../appwriteServices";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { postActions } from '../redux/slices';
import { useNavigate } from 'react-router-dom';

export default function usePosts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const createPost = async data => {
        try {
            data.file = data.file.length>0 ? data.file[0] : undefined;
            const postId = (await post_service.createPost(data)).$id;
            const post = await post_service.getPost(postId);
            dispatch(postActions.addPost(post));
            navigate(`../posts?id=${post.$id}`);
            toast.success('Post created');
        } catch (error) {
            toast.error("Can't create the post");
            console.error(error);
        }
    }
    const updatePost = async data => {
        console.log(data);
        // try {
        //     data.file = data.file.length>0 ? data.file[0] : undefined;
        //     const post = await post_service.updatePost(data);
        //     navigate(`../posts?id=${post.$id}`);
        //     toast.success('Post created');
        // } catch (error) {
        //     toast.error("Can't create the post");
        //     console.error(error);
        // }
    }
    const deletePost = async id => {
        try {
            await post_service.deletePost(id);
            dispatch(postActions.deletePost(id));
            toast.success('Post deleted');
        } catch (error) {
            toast.error("Can't delete the post");
            console.error(error);
        }
    }
    return {deletePost, createPost, updatePost};
}
