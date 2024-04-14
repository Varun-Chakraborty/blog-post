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