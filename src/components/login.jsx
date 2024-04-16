import { auth_service } from '../appwriteServices/index.js';
import { useDispatch } from 'react-redux';
import { actions } from '../redux/slices/userSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, InputField } from './index.js';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


/**
 * Login component for logging in a user
 *
 * @returns {React.Component} The login form
 */
export default function Login() {
    /**
     * The dispatch function to update the redux store
     * @type {Function}
     */
    const dispatch = useDispatch();
    /**
     * The navigate function to redirect the user to a different route
     * @type {Function}
     */
    const navigate = useNavigate();
    /**
     * The processing state of the login request
     * @type {boolean}
     */
    const [processing, setProcessing] = useState(false);
    /**
     * The register function and errors from the form
     * @type {{register: Function, formState: {errors: {email: {type: string}, password: {type: string}}}}} 
     */
    const { register, handleSubmit, formState: { errors } } = useForm();
    /**
     * The function to handle the login request
     * @param {Object} data The login data
     * @returns {Promise<void>}
     */
    const handleLogin = async data => {
        setProcessing(true);
        try {
            /**
             * If the login request was successful, get the user data
             * and update the redux store.
             * If the request failed, notify the user with a toast message.
             */
            const session = await auth_service.login(data);
            dispatch(actions.login(session ? await auth_service.getUser() : null));
            toast.success('Logged In');
            navigate('/');
        } catch (error) {
            if (error.name === 'AppwriteException') {
                toast.error(error.message)
            } else {
                toast.error("Can't login");
            }
            console.error(error);
        } finally {
            setProcessing(false);
        }
    }
    return (
        <form
            className="border rounded-lg flex flex-col items-center gap-7 p-5 shadow-md dark:shadow-white md:w-1/5 w-1/2"
            onSubmit={handleSubmit(handleLogin)}>
            <h1 className="text-2xl font-bold font-serif">Login</h1>
            <InputField
                /**
                 * Validates the email field to be a valid email
                 */
                {...register('email', { required: true, pattern: /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i })}
                placeholder="Email"
                name="email"
                autoComplete="email" />
            <InputField
                /**
                 * Validates the password field to be atleast 8 characters long
                 */
                {...register('password', { required: true, minLength: 8 })}
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="current-password" />
            <InputField
                containerClassName={`w-full flex items-center justify-center gap-2 flex-row-reverse ${(processing && 'opacity-50')}`}
                inputWidth='w-fit'
                label='Remember Me'
                type="checkbox"
                name="remember" />
            <div className="text-center">
                <div>New here?</div>
                <Link to='/register'>Register Now</Link>
            </div>
            <div className='text-red-500 dark:text-red-400 text-center'>
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
            <Button
                /**
                 * Disable the login button when the request is processing
                 */
                {...(processing && { disabled: true })}
                className={"border dark:border-white outline-none rounded-lg px-2 py-1 cursor-pointer hover:bg-white disabled:bg-white disabled:text-black hover:text-black"}
                type="submit">Login</Button>
        </form>
    );
}
