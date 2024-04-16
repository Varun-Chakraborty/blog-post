import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components";

/**
 * Layout component
 *
 * This component renders a layout for all pages, it includes a header
 * and a footer, and wraps the page's component inside the Outlet component
 * from react-router-dom, this component is used as a wrapper for all pages
 *
 * @returns {JSX.Element} The layout component
 */
export default function Layout() {
    return (
        <div className="h-screen">{/* The maximum height of the layout */}
            <Header className="flex justify-between items-center sticky top-0 bg-white dark:bg-black dark:text-white z-50" /> {/* The header of the page */}
            <Outlet /> {/* The page component, the page's component will be rendered inside this component */}
            <Footer classname="" /> {/* The footer of the page */}
        </div>
    );
}

