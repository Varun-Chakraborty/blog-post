import { MdComment } from "react-icons/md";
import Button from "./button";

export default function CommentButton({count=0, onClick=()=>{}}) {
    return (
        <Button
            onClick={onClick}
            className="flex items-center gap-2 text-blue-600 hover:bg-blue-200">
            <MdComment />
            <span>{count}</span>
        </Button>
    );
}