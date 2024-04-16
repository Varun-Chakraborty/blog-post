import { NavLink } from "react-router-dom";

/**
 * Component that renders the logo.
 *
 * @param {string} className - Additional class name to apply to the logo.
 *
 * @returns The logo component.
 */
export default function Logo({ className }) { // eslint-disable-line react/prop-types
    return (
        /* NavLink component that wraps the logo and makes it clickable */
        <NavLink /* eslint-disable-line jsx-a11y/anchor-is-valid */
            /* Link to the root path */
            to='/'
        >
            {/* HTML element that renders the logo text */}
            <span className={`font-bold font-serif ${className}`}>
                {/* Actual text of the logo */}
                Blog Post
            </span>
        </NavLink>
    );
}
