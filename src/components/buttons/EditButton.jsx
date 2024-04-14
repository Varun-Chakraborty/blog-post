import Button from "./button";

export default function EditButton({ onClick, className }) {
    return (
        <Button
            className={`bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`}
            onClick={onClick}>
            Edit
        </Button>
    );
}