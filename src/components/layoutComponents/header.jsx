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

export default function Header({ className }) {
    const [showDialog, setShowDialog] = useState(false);
    const loggedIn = useSelector(state => state.users.loggedIn);
    const [menuOpen, setIfMenuOpen] = useState(false);
    const [darkTheme, toggleTheme] = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            await auth_service.logout();
            dispatch(actions.logout());
            toast.success('Logged Out');
            navigate('/');
        } catch (error) {
            toast.error("Can't Log out");
            console.error(error);
        } finally {
            setShowDialog(false);
        }
    }
    const menus = [
        {
            option: 'home',
            link: '/',
        },
        {
            option: 'about',
            link: '/about',
        },
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
            <IoIosMenu
                onClick={() => setIfMenuOpen(prev => !prev)}
                className={"md:hidden relative z-50 transition-transform mx-1 cursor-pointer " + (menuOpen ? "rotate-90" : "rotate-0")} />
            <div className="w-full md:p-2 md:w-fit flex justify-center">
                <Logo className="text-lg sm:text-xl md:text-2xl uppercase" />
            </div>
            <ul className={'p-5 md:p-0 md:pr-2 flex-col bg-white dark:bg-black sm:flex-row absolute top-0 w-full justify-center md:items-center md:w-fit md:static flex transition-transform '
                + (menuOpen ? "translate-y-0 " : " -translate-y-full md:translate-y-0 ")}>
                {
                    menus.map(menu => (
                        <li key={menu.option}>
                            <Button
                                className='hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600'
                                onClick={() => {
                                    navigate(menu.link);
                                    setIfMenuOpen(false);
                                }}>
                                {menu.option}</Button>
                        </li>
                    ))
                }
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
                        {darkTheme ? <MdDarkMode /> : <MdLightMode />}
                    </Button>
                </li>
            </ul>
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