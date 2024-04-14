import React, { useEffect, useState } from "react";

function Modals({ msg, symbol, options, handleIfYes, timeOut = false, open = false, setShowDialog }, ref) {
    const [time, setTime] = useState(0);
    const [interval, getInterval] = React.useState(null);
    useEffect(() => {
        timeOut && setTime(() => {
            getInterval(setInterval(() => {
                setTime(time => time - 1);
            }, 1000));
            return 5;
        });
    }, []);
    return (
        <dialog
            open={open}
            className="open:fixed open:top-0 open:left-0 open:flex open:justify-center open:items-center open:h-full open:w-full bg-transparent"
            ref={ref}>
            <div className="w-full h-full opacity-40 fixed top-0 left-0 bg-gray-700 dark:bg-gray-100"></div>
            <div className="relative z-50 bg-white dark:bg-black dark:text-white py-4 px-5 rounded-xl flex">
                {symbol && <div className="flex justify-center items-center">{symbol}</div>}
                <div className="space-y-3">
                    <p>{msg}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                clearInterval(interval);
                                setShowDialog(false);
                            }}
                            className="border border-green-500 dark:text-white py-2 px-3 rounded-xl"
                            type="button">{options.negative}</button>
                        <button
                            {...(time > 0 && { disabled: true })}
                            onClick={handleIfYes}
                            className="bg-red-500 dark:bg-red-600 disabled:bg-gray-500 dark:disabled:bg-gray-600 text-white py-2 px-3 rounded-xl"
                            type="button">{options.positive} {time > 0 && `(${time})`}</button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default React.forwardRef(Modals);