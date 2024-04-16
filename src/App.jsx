import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Layout from './layout';
import { auth_service } from './appwriteServices';
import { userActions } from './redux/slices';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home, UserProfile, CreatePosts, ShowPost, About, Login, Register, NoRoute, EditPost } from './pages';

/**
 * The root component of the application.
 * It is responsible for the routing of the app and
 * handles the initialization of the user's session.
 */
export default function App() {
    // The user's logged in status
    const loggedIn = useSelector(state => state.users.loggedIn);
    // The dispatcher function to dispatch actions
    const dispatch = useDispatch();

    // Effect that runs on mount to get the user from appwrite
    useEffect(() => {
        // Get the user from appwrite
        auth_service.getUser()
            // If the user is found and authenticated, login them
            .then(user => user && dispatch(userActions.login(user)))
            // If there is an error, log it to the console
            .catch(error => console.error(error));
    }, []);

    // The router object for the app
    const router = createBrowserRouter([{
        // The root path of the app
        path: '/',
        // The layout component
        element: <Layout />,
        // The children of the root path
        children: [
            {
                // The path for the home page
                path: '',
                // The home page component
                element: <Home />,
            },
            {
                // The path for the about page
                path: 'about',
                // The about page component
                element: <About />,
            },
            {
                // The path for the user profile page
                path: 'profile',
                // If the user is logged in, show the user profile page
                element: loggedIn ? <UserProfile /> : <Navigate to='/login' />,
            },
            {
                // The path for the login page
                path: 'login',
                // If the user is logged in, navigate to the profile page
                element: loggedIn ? <Navigate to='/profile' /> : <Login />,
            },
            {
                // The path for the register page
                path: 'register',
                // If the user is logged in, navigate to the profile page
                element: loggedIn ? <Navigate to='/profile' /> : <Register />,
            },
            // If the user is logged in, show the create post and posts pages
            ...(loggedIn ? [
                {
                    // The path for the create post page
                    path: 'create-post',
                    // The create post page component
                    element: <CreatePosts />,
                },
                {
                    // The path for the posts page
                    path: 'posts',
                    // The children of the posts page
                    children: [
                        {
                            // The path for the posts page
                            path: '',
                            // The posts page component
                            element: <ShowPost />,
                        },
                        {
                            // The path for the edit post page
                            path: 'edit',
                            // The edit post page component
                            element: <EditPost />,
                        },
                    ]
                },
            ] : []),
            // The no route page component
            {
                path: '*',
                element: <NoRoute />
            }
        ]
    }]);

    // Render the toast container and the router provider
    return (
        <>
            {/* The toast container */}
            <ToastContainer position="top-right" />
            {/* The router provider */}
            <RouterProvider router={router} />
        </>
    );
}
