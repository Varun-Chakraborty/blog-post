import { MdDelete } from "react-icons/md";
import Button from "./button";
import { Loader } from "..";

export default function ShrinkedDeleteButton({ onClick, className, processing }) {
    return (
        <Button
            className={`bg-red-600 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 ${className}`}
            onClick={onClick}>
            {processing ? <Loader height="h-[20px]" /> : <MdDelete />}
        </Button>
    );
}