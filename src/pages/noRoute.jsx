import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * This is a component for handling unknown routes.
 * It navigates to the root path and shows a toast error message.
 */
export default function NoRoute() {
    const location = useLocation(); // gets the current location object

    return (
        <>
            {/* navigates to the root path (/) */}
            <Navigate to="/" replace />
            {/* shows a toast error message */}
            {toast.error(`Route: ${location.pathname} not found right now`)}
            
        </>
    );
}
