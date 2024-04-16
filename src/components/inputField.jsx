import React from "react";

/**
 * InputField component
 * Renders an input field with optional label
 * @param {string} label - Label text
 * @param {string} containerClassName - ClassName for the container div
 * @param {string} labelClassName - ClassName for the label
 * @param {string} className - ClassName for the input
 * @param {string} inputWidth - Input width (default: 'w-full')
 * @param {string} inputBgColor - Input background color (default: 'bg-inherit')
 * @param {string} inputTextColor - Input text color (default: 'text-inherit')
 * @param {string} name - Input name attribute
 * @param {object} props - Other props to pass to the input
 * @param {React.Ref} ref - Ref to pass to the input
 */
function InputField({
    label,
    containerClassName,
    labelClassName,
    className,
    inputWidth = 'w-full',
    inputBgColor = "bg-inherit",
    inputTextColor = "text-inherit",
    name = "",
    ...props
}, ref) {
    return (
        label ? (
            // Container div for the label and input
            <div className={containerClassName}>
                {/* Label */}
                <label className={labelClassName} htmlFor={name}>{label}</label>
                {/* Input */}
                <input
                    ref={ref}
                    // Styles for the input
                    className={`
                        border
                        ${inputWidth} 
                        outline-none 
                        rounded-lg 
                        px-2 
                        py-1 
                        focus:shadow 
                        dark:shadow-white 
                        ${inputBgColor} 
                        ${inputTextColor} 
                        ${className}
                    `}
                    // Name attribute
                    name={name}
                    // Other props
                    {...props}
                    // If label is present, add id to the input
                    {...label && { id: name }} />
            </div>
        ) : (
            // If there is no label, return just the input
            <>
                <input
                    ref={ref}
                    className={`
                        border 
                        ${inputWidth} 
                        outline-none 
                        rounded-lg 
                        px-2 
                        py-1 
                        ${inputBgColor} 
                        ${inputTextColor} 
                        ${className}
                    `}
                    name={name}
                    {...props}
                    {...label && { id: name }} />
            </>
        )
    );
}

export default React.forwardRef(InputField);