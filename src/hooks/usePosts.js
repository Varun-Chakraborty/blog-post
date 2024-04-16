import { post_service } from "../appwriteServices";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../redux/slices';
import { useNavigate } from 'react-router-dom';

/**
 * Hook that provides methods to interact with posts
 * @returns {Object} methods to interact with posts
 */
export default function usePosts() {
    // Retrieves the logged in user's information from the store
    const user = useSelector(state => state.users.userInfo);
    // Gets the Redux dispatch function
    const dispatch = useDispatch();
    // Gets the navigate function from react-router-dom
    const navigate = useNavigate();

    /**
     * Creates a new post
     * @param {Object} data - Post's data
     * @returns {Promise} the created post
     */
    const createPost = async data => {
        try {
            // If there is a file attached to the post, save it
            data.file = data.file.length > 0 ? data.file[0] : undefined;
            // Creates the post and retrieve it's ID
            const postId = (await post_service.createPost(data, user.$id, user.name)).$id;
            // Retrieves the created post
            const post = await post_service.getPost(postId);
            // Add the post to the store
            dispatch(postActions.addPost(post));
            // Navigate to the created post
            navigate(`../posts?id=${post.$id}`);
            // Show success message to the user
            toast.success('Post created');
        } catch (error) {
            // Show error message to the user
            toast.error("Can't create the post");
            // Log the error to the console
            console.error(error);
        }
    }

    /**
     * Updates a post
     * @param {Object} data - Post's data
     * @param {string} postId - Post's ID
     * @param {string} fileId - File's ID (if the post has a file attached)
     * @returns {Promise} the updated post
     */
    const updatePost = async (data, postId, fileId) => {
        try {
            // If there is a file attached to the post, save it
            data.file = data.file.length > 0 ? data.file[0] : undefined;
            // Update the post
            const post = await post_service.updatePost(data, postId, fileId);
            // Update the post in the store
            dispatch(postActions.updatePost({ id: postId, postData: post }));
            // Navigate to the updated post
            navigate(`../../posts?id=${post.$id}`);
            // Show success message to the user
            toast.success('Post updated');
        } catch (error) {
            // Show error message to the user
            toast.error("Can't update the post");
            // Log the error to the console
            console.error(error);
        }
    }

    /**
     * Deletes a post
     * @param {string} id - Post's ID
     * @returns {Promise} nothing
     */
    const deletePost = async id => {
        try {
            // Delete the post
            await post_service.deletePost(id);
            // Remove the post from the store
            dispatch(postActions.deletePost(id));
            // Show success message to the user
            toast.success('Post deleted');
        } catch (error) {
            // Show error message to the user
            toast.error("Can't delete the post");
            // Log the error to the console
            console.error(error);
        }
    }

    // Returns the three methods that can be used from the components
    return { deletePost, createPost, updatePost };
}
