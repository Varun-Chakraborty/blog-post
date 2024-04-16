import { auth_service } from '../appwriteServices';
import { useDispatch } from 'react-redux';
import { actions } from '../redux/slices/userSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, InputField } from '.';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


/**
 * Register page component.
 * @returns {JSX.Element} Register page.
 */
export default function Register() {
    // Redux store dispatch function
    const dispatch = useDispatch();
    // React Router navigate function
    const navigate = useNavigate();
    // Register processing state
    const [processing, setProcessing] = useState(false);
    // React Hook Forms register, handleSubmit and formState
    const { register, handleSubmit, formState: { errors } } = useForm();

    /**
     * Handle register form submission.
     * @param {object} data Register form data.
     * @returns {Promise<void>} Void promise.
     */
    const handleRegister = async (data) => {
        setProcessing(true);
        try {
            // Call Appwrite register API
            const session = await auth_service.register(data);
            // Get user data after login
            const user = session ? await auth_service.getUser() : null;
            // Update redux store with user data
            dispatch(actions.login(user));
            // Show success toast
            toast.success('Registered');
            // Navigate to home page
            navigate('/');
        } catch (error) {
            // Show error toast
            toast.error("Can't register");
            console.error(error);
        } finally {
            setProcessing(false);
        }
    }

    return (
        <form
            // Border, rounded and shadow styling
            className="border rounded-lg flex flex-col items-center gap-7 p-5 shadow-md dark:shadow-white md:w-1/5 w-1/2"
            onSubmit={handleSubmit(handleRegister)}>
            <h1 className="text-2xl font-bold font-serif text-center">Create an account</h1>
            <InputField
                // Register form name field
                {...register('name', { required: true })}
                placeholder="Name"
                name="name" />
            <InputField
                // Register form email field
                {...register('email', { required: true, pattern: /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/ })}
                placeholder="Email"
                name="email"
                autoComplete="email" />
            <InputField
                // Register form password field
                {...register('password', { required: true, minLength: 8 })}
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="current-password" />
            <InputField
                // Register form remember me checkbox
                containerClassName='w-full flex items-center justify-center gap-2 flex-row-reverse'
                inputWidth='w-fit'
                label='Remember Me'
                type="checkbox"
                name="remember" />
            <div className="text-center">
                <div>Already a member?</div>
                <Link to='/login'>Login Now</Link>
            </div>
            <div className='text-red-500 dark:text-red-400 text-center'>
                {/* Register form name field error */}
                {errors?.name?.type === 'required' && (
                    <>
                        <span>Name field is required</span>
                        <br />
                    </>
                )}
                {/* Register form email field error */}
                {errors?.email?.type === 'pattern' && (
                    <>
                        <span>Email doesn't seems valid</span>
                        <br />
                    </>
                )}
                {errors?.email?.type === 'required' && (
                    <>
                        <span>Email field is required</span>
                        <br />
                    </>
                )}
                {/* Register form password field error */}
                {errors?.password?.type === 'required' && (
                    <>
                        <span>Password field is required</span>
                        <br />
                    </>
                )}
                {errors?.password?.type === 'minLength' && (
                    <>
                        <span className='text-wrap'>Password must atleast be of 8 characters</span>
                        <br />
                    </>
                )}
            </div>
            {/* disable submit button when the request is processing */}
            <Button
                {...(processing && { disabled: true })}
                className={"border dark:border-white outline-none rounded-lg px-2 py-1 cursor-pointer hover:bg-white disabled:bg-white disabled:text-black hover:text-black"}
                type="submit">Create now</Button>
        </form>
    );
}
