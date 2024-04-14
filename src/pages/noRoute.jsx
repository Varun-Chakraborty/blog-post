import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function NoRoute() {
    const location = useLocation();
    return (
        <>
            < Navigate to='/' replace />
            {toast.error(`Route: ${location} not found right now`)}
        </>
    );
}