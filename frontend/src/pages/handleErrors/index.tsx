import { Link, useRouteError } from 'react-router-dom';
export function HandleErrors() {
  const error = useRouteError() as Error;
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-500 dark:text-gray-100 mb-4">
          Oops! That doesn't look right.
        </h1>
        <span className="text-white/40">
          <p className="text-2xl font-medium mt-8 mb-2">
            You got following error:
          </p>
          <p className="text-lg text-left px-5">
            <i>
              <span className="underline">Message</span>
              {': '}
              {error.message}
            </i>
            <i className="block">
              <span className="underline">Stack</span>
              {': '}
              <pre className="pl-5">{error.stack}</pre>
            </i>
          </p>
          <p className="text-lg text-left p-4">
            Not your site?{' '}
            <Link to="#" className="underline-offset-4 hover:underline">
              Contact developer
            </Link>
          </p>
        </span>
      </div>
    </div>
  );
}
