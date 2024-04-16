import { NavLink } from 'react-router-dom';
import { Button, Logo } from "..";

/**
 * The footer component.
 * @param {string} classname - The class name for the footer.
 */
export default function Footer({ classname }) {
    /**
     * The links for the footer.
     */
    const links = [
        {
            /**
             * The title of the link.
             */
            title: 'pages',
            /**
             * The links for the title.
             */
            links: [
                {
                    /**
                     * The title of the link.
                     */
                    title: 'home',
                    /**
                     * The route of the link.
                     */
                    to: '/'
                },
                {
                    /**
                     * The title of the link.
                     */
                    title: 'about',
                    /**
                     * The route of the link.
                     */
                    to: '/'
                },
            ]
        },
    ];

    return (
        /**
         * The footer element.
         */
        <footer className={"p-2 dark:bg-black dark:text-white " + classname}>
            <div>
                <div className='flex justify-between'>
                    <Logo className='text-2xl' />
                    <Button onClick={() => { }} />
                </div>
            </div>
            <div className="flex w-1/2 gap-3 flex-wrap justify-between pr-5">
                {links.map(link => (
                    <ul key={link.title} className="flex flex-col list-disc list-inside">
                        <div className="font-bold uppercase">{link.title}</div>
                        {link.links.map(link => (
                            <li key={link.title}>
                                <NavLink className='hover:underline capitalize' 
                                    to={link.to}>
                                    {link.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </footer>
    );
}
