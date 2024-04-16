import { MdShare } from "react-icons/md";
import Button from "./button";

/**
 * A share button component
 * 
 * @param {Object} props
 * @param {number} [props.count=0] Count of shares for this post
 * @param {Function} [props.onClick=()=>{}] Function to call when the button is clicked
 */
export default function SharePost({ count = 0, onClick = () => {} }) {
    return (
        <Button
            onClick={onClick}
            className="flex items-center gap-2 text-green-600 hover:bg-gray-200">
            <MdShare /> {/* Render the share icon */}
            <span>{count}</span> {/* Render the share count */}
        </Button>
    );
}
