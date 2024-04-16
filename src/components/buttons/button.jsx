/**
 * A simple button component
 * @param {Function} onClick - The onClick event handler
 * @param {ReactNode} children - The button's content
 * @param {string} [type="button"] - The button's type attribute
 * @param {string} [className=""] - Additional class names to apply to the button
 * @param {Object} [...props] - Any other props are spread onto the button element
 */
export default function Button({
    onClick,
    children,
    type = "button",
    className = "",
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`uppercase p-2 block rounded-lg border-black cursor-pointer select-none ${className}`} {...props}>
            {children}
        </button>
    );
}
