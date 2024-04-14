import React from 'react';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor({ name = 'content', defaultCont = '', control }) {
    return (
        <Controller
            rules={{ required: true }}
            control={control}
            name={name ? name : 'textarea'}
            render={({ field: { onChange } }) => (
                <Editor
                    onEditorChange={onChange}
                    apiKey='qt95pr433jk85wl21ne6o5p31gflf9rr5zj8e5f0nl66mtaw'
                    initialValue={defaultCont}
                    init={{
                        selector: 'textarea#content',
                        resize: false,
                        branding: false,
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                        toolbar: 'undo redo bold italic underline strikethrough | blocks fontfamily fontsize | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                        ],
                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                    }} />
            )} />
    );
}