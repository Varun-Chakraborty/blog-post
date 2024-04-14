import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import Button from "./button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function LikeButton({ likes=[], id }) {
    const userId = useSelector(state => state.users.userInfo.$id);
    const [likesState, setLikesState] = useState(null);
    const [liked, setIfLiked] = useState(false);
    const [changed, setIfChanged] = useState(false);
    const toggleLike = async (liked=false, setIfLiked=()=>{}, setLikedList=()=>{}) => {
        if (liked) {
            setLikedList(prev => prev.filter(id => id !== userId));
            setIfLiked(false);
        } else {
            setLikedList(prev => [userId, ...prev]);
            setIfLiked(true);
        }
        setIfChanged(true);
    }
    useEffect(() => {
        if (changed) {
            
        }
    }, [changed]);
    useEffect(() => {
        setLikesState(likes);
        setIfLiked(likes.indexOf(userId) >= 0);
    }, []);
    return (
        <Button
            onClick={()=>toggleLike(liked, setIfLiked, setLikesState)}
            className="flex items-center gap-2 text-red-600 hover:bg-red-200">
            {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
            <span>{likesState?.length}</span>
        </Button>
    );
}