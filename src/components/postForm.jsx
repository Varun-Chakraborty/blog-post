import { toast } from 'react-toastify';
import { Button, InputField, TextEditor } from '.';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePosts } from '../hooks';

/**
 * Post form component for creating or editing a post
 *
 * @param {Object} data - If it is passed, it is used for editing, otherwise it is for creating a new post
 * @returns {JSX.Element} - Rendered PostForm component
 */
export default function PostForm({ data }) {
    const [creating, setIfCreating] = useState(false);
    /**
     * React Hook Form hook object to handle form inputs
     */
    const { register, handleSubmit, formState: { errors }, watch, control, setValue } = useForm();

    /**
     * Sets the initial values for the form inputs
     */
    useEffect(() => {
        if (data) {
            setValue('title', data.title);
            setValue('content', data.content);
        }
    }, []);
    const { createPost, updatePost } = usePosts();

    /**
     * Sets the value of slug based on the title input
     */
    setValue('slug', watch('title')?.toLowerCase().replace(/[^a-z\d]+/g, '-').replace(/^-+|-+$/g, ''));

    /**
     * Handles submission of the form
     *
     * @param {Object} formData - Form input data
     */
    const handleSubmitFunction = handleSubmit((formData) => {
        if (data) {
            setIfCreating(true);
            updatePost(formData, data.$id, data.reference_to_picture)
                .then(() => setIfCreating(false));
        } else {
            setIfCreating(true);
            createPost(formData)
                .then(() => setIfCreating(false));
        }
    }, () => {
        if (errors?.title?.type === 'required') toast.error('No title is given');
        else if (errors?.content?.type === 'required') toast.error('No content is given');
    });

    return (
        <>
            <form
                className="p-3 flex justify-between flex-col md:flex-row"
                onSubmit={handleSubmitFunction}>
                <div className="space-y-4 w-full md:w-3/5 p-2">
                    <InputField
                        {...register('title', { required: true })}
                        label='Title'
                        containerClassName="flex flex-col"
                        labelClassName="font-bold font-serif uppercase"
                        type="text"
                        name="title"
                        placeholder="Title" />
                    <InputField
                        {...register('slug')}
                        placeholder='Slug'
                        label='Slug'
                        containerClassName="flex flex-col"
                        labelClassName="font-bold font-serif uppercase"
                        type="text"
                        readOnly />
                    <div>
                        <label className="block font-bold font-serif uppercase">Content</label>
                        <TextEditor defaultCont={data?.content} name='content' control={control} />
                    </div>
                </div>
                <div className="space-y-4 w-full md:w-2/5 p-2">
                    <InputField
                        {...register('file')}
                        label='File'
                        containerClassName="flex flex-col"
                        labelClassName="font-bold font-serif uppercase"
                        type="file" name="file" id="file" />
                    <Button
                        className={"block outline-none font-serif uppercase rounded-lg text-white px-2 py-1 w-full " + (creating ? " bg-gray-600 " : " bg-blue-600 hover:bg-blue-500 ")}
                        type="submit">Submit</Button>
                </div>
            </form>
        </>
    );
}
