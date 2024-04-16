/**
 * Loader component
 *
 * This component renders a loader, it uses a div with a
 * className that contains the animate-spin class from
 * tailwindcss to animate the loader
 *
 * @param {string} height - The height of the loader
 *
 * @returns {JSX.Element} The loader component
 */
export default function Loader({height}) {
    return (
        <div className="flex justify-center items-center">{/* The container of the loader */}
            <div className={"animate-spin rounded-full aspect-square border-y border-gray-900 dark:border-gray-200 " +
                (height ? height : 'h-10')}></div>{/* The loader itself */}
        </div>
    );
}