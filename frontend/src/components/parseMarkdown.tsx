export function ParseMarkdown({
  markdown
}: {
  markdown?: string;
}): React.ReactNode {
  const lines = markdown?.split('\n');
  return (
    lines?.map(line => {
      // if line begin with hashes put it inside heading tag
      if (line.startsWith('### ')) {
        return (
          <h3 className="text-xl font-semibold">{line.split('### ')[1]}</h3>
        );
      } else if (line.startsWith('## ')) {
        return <h2 className="text-2xl font-bold">{line.split('## ')[1]}</h2>;
      } else if (line.startsWith('# ')) {
        return (
          <>
            <h1 className="text-3xl pb-2 font-extrabold">
              {line.split('# ')[1]}
            </h1>
            <hr />
          </>
        );
      } else if (line.startsWith('- ')) {
        return (
          <ul className="list-disc list-inside">
            <li>{line.split('- ')[1]}</li>
          </ul>
        );
      } else if (line.startsWith('<')) {
        return (
          // render line as tag
          <div dangerouslySetInnerHTML={{ __html: line }} />
        );
      } else {
        return <span className="block">{line}</span>;
      }
    }) ?? <></>
  );
}
