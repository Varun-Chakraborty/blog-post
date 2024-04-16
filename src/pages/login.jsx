import { Login as LoginForm } from '../components';

/**
 * Login Page
 *
 * This is the login page of the app.
 * It renders the LoginForm component.
 */
export default function Login() {
    return (
        // The main container with a min-height of full viewport height,
        // a background color and a flex layout for centering the login form.
        <main className="min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white flex items-center justify-center">
            {/* The LoginForm component. */}
            <LoginForm />
        </main>
    );
}
