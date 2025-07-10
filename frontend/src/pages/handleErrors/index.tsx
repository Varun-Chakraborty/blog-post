import { Link, useRouteError } from 'react-router-dom';
export function HandleErrors() {
	const error = useRouteError() as Error;
	return (
		<div className="h-svh w-svw overflow-auto bg-background flex flex-col">
			<div className="text-gray-500 dark:text-gray-100 flex justify-center items-center h-1/5">
				<h1 className="text-4xl font-extrabold -w-fit">
					Oops! That doesn't look right.
				</h1>
			</div>
			<div className="text-primary/80 dark:text-white/40 px-5 h-full">
				<p className="text-xl font-medium">You got following error:</p>
				<div className="h-4/5 overflow-y-auto">
					<p>
						<span className="underline">Message: </span>
						{error.message}
					</p>
					<div>
						<span className="underline">Stack: </span>
						<pre className="pl-5">{error.stack}</pre>
					</div>
				</div>
				<div className="p-4">
					<span>Not your site? </span>
					<Link
						to="mailto:V4v7t@example.com"
						className="underline-offset-4 hover:underline"
					>
						Contact developer
					</Link>
				</div>
			</div>
		</div>
	);
}
