import React from "react";

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
            <div className={containerClassName}>
                <label className={labelClassName} htmlFor={name}>{label}</label>
                <input
                    ref={ref}
                    className={`border ${inputWidth} outline-none rounded-lg px-2 py-1 focus:shadow dark:shadow-white ${inputBgColor} ${inputTextColor} ${className}`}
                    name={name}
                    {...props}
                    {...label && { id: name }} />
            </div>
        ) : (
            <>
                <input
                    ref={ref}
                    className={`border ${inputWidth} outline-none rounded-lg px-2 py-1 ${inputBgColor} ${inputTextColor} ${className}`}
                    name={name}
                    {...props}
                    {...label && { id: name }} />
            </>
        ));
}

export default React.forwardRef(InputField);