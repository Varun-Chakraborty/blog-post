import { auth_service } from '../appwriteServices/index.js';
import { useDispatch } from 'react-redux';
import { actions } from '../redux/slices/userSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, InputField } from './index.js';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const handleLogin = async data => {
        setLoading(true);
        try {
            const session = await auth_service.login(data);
            dispatch(actions.login(session ? await auth_service.getUser() : null));
            toast.success('Logged In');
            navigate('/');
        } catch (error) {
            if (error.name==='AppwriteException') {
                toast.error(error.message)
            } else {
                toast.error("Can't login");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <form
            className="border rounded-lg flex flex-col items-center gap-7 p-5 shadow-md dark:shadow-white md:w-1/5 w-1/2"
            onSubmit={handleSubmit(handleLogin)}>
            <h1 className="text-2xl font-bold font-serif">Login</h1>
            <InputField
                {...register('email', { required: true, pattern: /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i })}
                placeholder="Email"
                name="email"
                autoComplete="email" />
            <InputField
                {...register('password', { required: true, minLength: 8 })}
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="current-password" />
            <InputField
                containerClassName='w-full flex items-center justify-center gap-2 flex-row-reverse'
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
                {...(loading && { disabled: true })}
                className={"border dark:border-white outline-none rounded-lg px-2 py-1 cursor-pointer hover:bg-white disabled:bg-white disabled:text-black hover:text-black"}
                type="submit">Login</Button>
        </form>
    );
}