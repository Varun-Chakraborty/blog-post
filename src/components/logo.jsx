import { NavLink } from "react-router-dom";

export default function Logo({className}) {
    return (
        <NavLink to='/'>
            <span className={"font-bold font-serif "+className}> Blog Post</span >
        </NavLink>
    );
}