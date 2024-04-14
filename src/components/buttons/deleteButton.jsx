import Loader from "../loader";
import Button from "./button";

export default function DeleteButton({ onClick, className, processing }) {
    return (
        <Button
            className={`bg-red-600 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 ${className}`}
            onClick={onClick}>
            {processing ? <Loader height="h-[20px]" /> : 'Delete'}

        </Button>
    );
}