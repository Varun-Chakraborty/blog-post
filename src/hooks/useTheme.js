import { useEffect, useState } from "react";

export default function useTheme() {
    const [darkTheme, setIfDarkTheme] = useState(false);
    useEffect(() => {
        const theme = localStorage.getItem('dark');
        setIfDarkTheme(theme ? JSON.parse(theme).darkTheme : false);
    }, []);
    useEffect(() => {
        document.querySelector('html').classList.toggle('dark', darkTheme);
    }, [darkTheme])
    const toggleTheme = () => {
        setIfDarkTheme(prev => {
            localStorage.setItem('dark', JSON.stringify(
                { darkTheme: !prev }
            ));
            return !prev;
        });
    }
    return [darkTheme, toggleTheme];
}