import { NavLink } from 'react-router-dom';
import { Button, Logo } from "..";

export default function Footer({ classname }) {
    const links = [
        {
            title: 'pages',
            links: [
                {
                    title: 'home',
                    to: '/'
                },
                {
                    title: 'about',
                    to: '/'
                },
            ]
        },
    ];
    return (
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
                                <NavLink className='hover:underline capitalize' to={link.to}>{link.title}</NavLink>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </footer>
    );
}