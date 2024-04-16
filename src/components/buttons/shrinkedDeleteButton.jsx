import { MdDelete } from "react-icons/md";
import Button from "./button";
import { Loader } from "..";

/**
 * ShrinkedDeleteButton component
 *
 * This is a special purpose delete button to be displayed on
 * smaller screens or small components.
 *
 * The processing prop is a boolean that is used to indicate if
 * the button is currently processing some delete task, if it is
 * true the button will display a loader instead of the trash
 * can icon.
 *
 * @param {Function} onClick - The function to call when the button is clicked
 * @param {string} className - The custom tailwindcss classes to add to the button
 * @param {boolean} processing - A boolean indicating if the button is currently processing the delete task
 *
 * @returns {JSX.Element} The shrinked delete button component
 */
export default function ShrinkedDeleteButton({ onClick, className, processing }) {
    return (
        <Button
            className={`bg-red-600 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 ${className}`}
            onClick={onClick}>
            {/* If the button is currently processing something display a loader, otherwise display a trash can icon */}
            {processing ? <Loader height="h-[20px]" /> : <MdDelete />}
        </Button>
    );
}
