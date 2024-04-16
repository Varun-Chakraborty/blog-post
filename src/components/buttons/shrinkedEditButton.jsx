import { MdEdit } from "react-icons/md";
import Button from "./button";

/**
 * A shrinked edit button component

 * This is a special purpose edit button to be displayed on
 * smaller screens or small components.
 * 
 * @param {Function} onClick - The function to call when the button is clicked
 * @param {string} [className=""] - Additional class names to apply to the button
 * 
 * @returns {JSX.Element} The shrinked edit button component
 */
export default function ShrinkedEditButton({ onClick, className = "" }) {
    return (
        <Button
            className={`
                bg-blue-600
                hover:bg-blue-500
                dark:bg-blue-500
                dark:hover:bg-blue-600
                ${className}
            `}
            onClick={onClick}>
            <MdEdit />
        </Button>
    );
}
