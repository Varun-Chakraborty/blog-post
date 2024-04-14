export default function Loader({height}) {
    return (
        <div className="flex justify-center items-center">
            <div className={"animate-spin rounded-full aspect-square border-y border-gray-900 dark:border-gray-200 " +
                (height ? height : `h-10`)}></div>
        </div>
    );
};
