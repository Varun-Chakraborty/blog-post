import { ChangeEvent, ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { ParseMarkdown } from '@/components/paseMarkdown.tsx';

export const Editor = forwardRef(function (
  { onChange, value }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>)=>void, value: string },
  ref: ForwardedRef<HTMLDivElement>
) {
  const [content, setContent] = useState(value);
  useEffect(()=> {
    setContent(value)
  }, [value])
  return (
    <div ref={ref} className="flex bg-zinc-800 h-[400px] rounded-lg overflow-clip">
      <div className="w-full h-full flex flex-col p-2 border-r">
        <div className="py-2">Markdown</div>
        <div className='h-full rounded-lg overflow-clip'>
          <textarea className="w-full bg-black h-full resize-none outline-none p-2" onChange={e => {
            onChange(e);
            setContent(e.currentTarget.value);
          }} value={content} />
        </div>
      </div>
      <div className="w-full h-full flex flex-col p-2 border-l">
        <div className="py-2">Preview</div>
        <div className="bg-zinc-700 h-full p-2 rounded-lg overflow-clip">
          <ParseMarkdown markdown={content} />
        </div>
      </div>
    </div>
  );
});
