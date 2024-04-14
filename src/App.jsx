import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Layout from './layout';
import { auth_service } from './appwriteServices';
import { userActions } from './redux/slices';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home, UserProfile, CreatePosts, ShowPost, About, Login, Register, NoRoute, EditPost } from './pages';

export default function App() {
    const loggedIn = useSelector(state => state.users.loggedIn);
    const dispatch = useDispatch();
    useEffect(() => {
        auth_service.getUser()
            .then(user => user && dispatch(userActions.login(user)))
            .catch(error => console.error(error));
    }, []);
    const router = createBrowserRouter([{
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'profile',
                element: loggedIn ? <UserProfile /> : <Navigate to='/login' />,
            },
            {
                path: 'login',
                element: loggedIn ? <Navigate to='/profile' /> : <Login />,
            },
            {
                path: 'register',
                element: loggedIn ? <Navigate to='/profile' /> : <Register />,
            },
            ...(loggedIn ? [
                {
                    path: 'create-post',
                    element: <CreatePosts />,
                },
                {
                    path: 'posts',
                    children: [
                        {
                            path: '',
                            element: <ShowPost />,
                        },
                        {
                            path: 'edit',
                            element: <EditPost />,
                        },
                    ]
                },
            ] : []),
            {
                path: '*',
                element: <NoRoute />
            }
        ]
    }]);

    return (
        <>
            <ToastContainer position="top-right" />
            <RouterProvider router={router} />
        </>
    );
}