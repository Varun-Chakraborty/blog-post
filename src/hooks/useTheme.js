import { useEffect, useState } from "react";

/**
 * Custom React hook that manages the theme of the app.
 * @returns {array} An array with the current theme and a function to toggle it
 */
export default function useTheme() {
    // Store the current theme in a state variable
    const [darkTheme, setIfDarkTheme] = useState(false);

    // When the component mounts, set the theme based on the saved theme in localStorage
    useEffect(() => {
        const theme = localStorage.getItem('dark');
        if (theme) {
            setIfDarkTheme(JSON.parse(theme).darkTheme);
        }
    }, []);

    // Add or remove the 'dark' class from the <html> element based on the current theme
    useEffect(() => {
        document.querySelector('html').classList.toggle('dark', darkTheme);
    }, [darkTheme]);

    /**
     * Toggle the current theme
     * @returns {void}
     */
    const toggleTheme = () => {
        setIfDarkTheme(prev => {
            localStorage.setItem('dark', JSON.stringify({
                darkTheme: !prev
            }));
            return !prev;
        });
    }

    // Return the current theme and the toggleTheme function
    return [darkTheme, toggleTheme];
}
