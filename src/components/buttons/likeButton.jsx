import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import Button from "./button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

/**
 * A like button component.
 * @param {object} props Component props
 * @param {Array<string>} props.likes An array of user ids that have liked the post
 * @param {string} props.id The post id
 * @returns The like button component
 */
export default function LikeButton({ likes = [], id }) {
    // Redux state
    const userId = useSelector(state => state.users.userInfo.$id);

    // Component state
    const [likesState, setLikesState] = useState(null);
    const [liked, setIfLiked] = useState(false);
    const [changed, setIfChanged] = useState(false);

    /**
     * Toggles the like status of the post.
     * @param {boolean} liked The current like status of the post
     * @param {function} setIfLiked Set the like status of the post
     * @param {function} setLikedList Set the array of user ids that have liked the post
     */
    const toggleLike = async (liked = false, setIfLiked = () => {}, setLikedList = () => {}) => {
        if (liked) {
            setLikedList(prev => prev.filter(id => id !== userId));
            setIfLiked(false);
        } else {
            setLikedList(prev => [userId, ...prev]);
            setIfLiked(true);
        }
        setIfChanged(true);
    }

    // Effects
    useEffect(() => {
        if (changed) {
            
        }
    }, [changed]);

    // Initialize like state
    useEffect(() => {
        setLikesState(likes);
        setIfLiked(likes.indexOf(userId) >= 0);
    }, []);

    return (
        <Button
            onClick={() => toggleLike(liked, setIfLiked, setLikesState)}
            className="flex items-center gap-2 text-red-600 hover:bg-red-200">
            {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
            <span>{likesState?.length}</span>
        </Button>
    );
}

