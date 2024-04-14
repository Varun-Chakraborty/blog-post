import { useEffect, useState } from "react";
import { post_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Loader, PostForm } from "../components";

export default function EditPost() {
    const [data, setData] = useState(null);
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const id = searchParams.get('id');
        post_service.getPost(id)
            .then(data => setData(data))
            .catch(error => {
                toast.error('Error fetching data');
                console.error(error);
            });
    }, []);
    return (
        <main
            className={"min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white p-2 "}>
            {data ? <PostForm data={data} /> : <Loader />}
        </main>
    );
}