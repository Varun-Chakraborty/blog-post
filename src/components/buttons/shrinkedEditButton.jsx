import { MdEdit } from "react-icons/md";
import Button from "./button";

export default function ShrinkedEditButton({ onClick, className }) {
    return (
        <Button
            className={`bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`}
            onClick={onClick}>
            <MdEdit />
        </Button>
    );
}