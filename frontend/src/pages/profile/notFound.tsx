export function NotFound() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-5">404 - Requested User Profile Not Found</h1>
      <div className="flex gap-6">
        <button className="bg-accent px-3 py-2 rounded-lg uppercase font-bold">Go Home</button>
        <button className="bg-accent px-3 py-2 rounded-lg uppercase font-bold">Go Back</button>
      </div>
    </div>
  );
}