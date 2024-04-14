import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components";

export default function Layout() {
    return (
        <div className="h-screen">
            <Header className="flex justify-between items-center sticky top-0 bg-white dark:bg-black dark:text-white z-50" />
            <Outlet />
            <Footer classname="" />
        </div>
    );
}