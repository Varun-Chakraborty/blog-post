import { Register as RegisterForm } from '../components';

/**
 * Register Page
 * 
 * This is the register page of the app. It renders the register form.
 * 
 * @returns {JSX.Element} The register page
 */
export default function Register() {
    return (
        <main
            className="min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white flex items-center justify-center relative">
            {/* Render the RegisterForm component */}
            <RegisterForm />
        </main>
    );
}
