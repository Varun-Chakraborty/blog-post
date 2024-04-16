import Button from "./button";

/**
 * A button that triggers an edit action
 * 
 * @param {Function} onClick - The function to call when the button is clicked
 * @param {string} [className=""] - Additional class names to apply to the button
 * 
 * @returns {JSX.Element} The edit button component
 */
export default function EditButton({ onClick, className = "" }) {
    return (
        <Button
            className={`bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`}
            onClick={onClick}>
            Edit
        </Button>
    );
}

