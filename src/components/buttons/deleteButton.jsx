import Loader from "../loader";
import Button from "./button";

/**
 * DeleteButton component
 *
 * This component renders a delete button, it uses a
 * custom button component and passes it a className that
 * contains some tailwindcss classes to style the button.
 *
 * The processing prop is a boolean that is used to indicate if
 * the button is currently processing something, if it is
 * true the button will display a loader instead of the text
 * "Delete".
 *
 * @param {Function} onClick - The function to call when the button is clicked
 * @param {string} className - The custom tailwindcss classes to add to the button
 * @param {boolean} processing - A boolean indicating if the button is currently processing the delete task
 *
 * @returns {JSX.Element} The delete button component
 */
export default function DeleteButton({ onClick, className, processing }) {
    return (
        <Button
            className={`bg-red-600 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 ${className}`}
            onClick={onClick}>
            {processing ? <Loader height="h-[20px]" /> : 'Delete'}

        </Button>
    );
}
