import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col justify-center items-center text-gray">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-extrabold text-gray-500 dark:text-gray-100 mb-4">
          404
        </h1>
        <span className="text-primary/80">
          <p className="text-2xl font-medium mt-8 mb-2">
            Oops! The page you’re looking for doesn’t exist.
          </p>
          <p className="text-lg">It might have been moved or deleted.</p>
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300"
        >
          Go to Previous Page
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
