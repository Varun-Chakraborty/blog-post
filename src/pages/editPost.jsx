import { useEffect, useState } from "react";
import { post_service } from "../appwriteServices";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Loader, PostForm } from "../components";
import { useSelector } from "react-redux";

export default function EditPost() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const data = useSelector(state => state.posts.posts.filter(post => post.$id === id)[0]);
    return (
        <main
            className={"min-h-full bg-slate-100 dark:bg-slate-800 dark:text-white p-2 "}>
            {data ? <PostForm data={data} /> : <Loader />}
        </main>
    );
}