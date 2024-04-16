import { IoIosMenu } from 'react-icons/io';
import { Logo, Button, Modals } from '..';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { auth_service } from '../../appwriteServices';
import { actions } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../../hooks';

/**
 * The header component that is rendered on every page
 *
 * @param {string} className The className of the header
 * @returns {JSX.Element} The rendered header component
 */
export default function Header({ className }) {
    // The state of the dialog that is shown when the user wants to logout
    const [showDialog, setShowDialog] = useState(false);
    // The loggedIn state of the user
    const loggedIn = useSelector(state => state.users.loggedIn);
    // The state of the menu, which is hidden on desktop and shown on mobile
    const [menuOpen, setIfMenuOpen] = useState(false);
    // The theme of the app
    const [darkTheme, toggleTheme] = useTheme();
    // The function to navigate to a new page
    const navigate = useNavigate();
    // The function to dispatch actions
    const dispatch = useDispatch();
    /**
     * The function that handles the logout functionality, it logs out the user
     * and redirects them to the home page
     */
    const handleLogout = async () => {
        try {
            // Logout the user
            await auth_service.logout();
            // Dispatch the logout action
            dispatch(actions.logout());
            // Show a success toast to the user
            toast.success('Logged Out');
            // Navigate the user to the home page
            navigate('/');
        } catch (error) {
            // Show an error to the user
            toast.error("Can't Log out");
            // Log the error to the console
            console.error(error);
        } finally {
            // Close the dialog
            setShowDialog(false);
        }
    }
    // The array of options that are shown in the menu
    const menus = [
        {
            option: 'home',
            link: '/',
        },
        {
            option: 'about',
            link: '/about',
        },
        // If the user is logged in, show the create post and profile options
        ...(loggedIn ? [
            {
                option: 'create post',
                link: '/create-post'
            },
            {
                option: 'profile',
                link: '/profile'
            },
        ] : [
            {
                option: 'login',
                link: '/login'
            }
        ])
    ]
    return (
        <header className={className}>
            {/* The menu icon that is only shown on mobile */}
            <IoIosMenu
                onClick={() => setIfMenuOpen(prev => !prev)}
                className={"md:hidden relative z-50 transition-transform mx-1 cursor-pointer " + (menuOpen ? "rotate-90" : "rotate-0")} />
            <div className="w-full md:p-2 md:w-fit flex justify-center">
                {/* The logo of the app */}
                <Logo className="text-lg sm:text-xl md:text-2xl uppercase" />
            </div>
            <ul className={
                // The classNames of the menu, which is hidden on desktop and shown on mobile
                'p-5 md:p-0 md:pr-2 flex-col bg-white dark:bg-black sm:flex-row absolute top-0 w-full justify-center md:items-center md:w-fit md:static flex transition-transform ' +
                (menuOpen ? "translate-y-0 " : " -translate-y-full md:translate-y-0 ")
            }>
                {/* Render the menus based on the array of options */}
                {menus.map(menu => (
                    <li key={menu.option}>
                        <Button
                            className='hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600'
                            onClick={() => {
                                navigate(menu.link);
                                setIfMenuOpen(false);
                            }}>
                            {menu.option}</Button>
                    </li>
                ))}
                {/* If the user is logged in, show the logout option */}
                {loggedIn && (
                    <li>
                        <Button
                            className='hover:bg-red-500 active:bg-red-600 dark:hover:bg-red-600 dark:active:bg-red-500 hover:text-white'
                            onClick={() => {
                                setShowDialog(true);
                                setIfMenuOpen(false);
                            }}>
                            Logout
                        </Button>
                    </li>
                )}
                <li className='flex items-center'>
                    <Button
                        className='hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600'
                        onClick={() => {
                            toggleTheme();
                            setIfMenuOpen(false);
                        }}>
                        {/* Render the appropriate icon based on the theme */}
                        {darkTheme ? <MdDarkMode /> : <MdLightMode />}
                    </Button>
                </li>
            </ul>
            {/* If the dialog is shown, render the dialog */}
            {showDialog && (
                <Modals
                    timeOut={true}
                    setShowDialog={setShowDialog}
                    open={showDialog}
                    msg='are you sure that you want to logout?'
                    options={{ positive: 'Yes', negative: 'No' }}
                    handleIfYes={handleLogout} />
            )}
        </header>
    );
}
