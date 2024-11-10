import { ForwardedRef, forwardRef, useEffect } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';

interface EditorComponentProps {
  onChange: (data: OutputData) => void;
  value: OutputData;
}

export const Editor = forwardRef(function (
  { onChange, value }: EditorComponentProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editor',
      placeholder: 'Type here...',
      onChange: async function () {
        const content = await editor.save();
        onChange(content);
      },
      data: value
    });

    return () => editor.destroy();
  }, [onChange, value]);

  return (
    <div ref={ref} className="border border-gray-200 rounded" id="editor" />
  );
});
