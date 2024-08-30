import api from "@/api";
import { InfiniteLoader } from "@/components/loaders";
import { cn } from "@/lib/utils";
import { APIResponseTypes } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Search({ className }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<APIResponseTypes.SearchResult[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      if (
        new URLSearchParams(window.location.search).get("q") !== searchQuery
      ) {
        const searchQuery = new URLSearchParams(window.location.search).get(
          "q"
        );
        setSearchQuery(searchQuery!);
        (async function () {
          try {
            await api.search(searchQuery!).then((searchResults) => {
              setResults(searchResults);
            });
          } finally {
            setLoading(false);
          }
        })();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [new URLSearchParams(window.location.search).get("q")]);
  return (
    <div className={cn("h-full w-full box-border", className)}>
      {loading ? (
        <InfiniteLoader />
      ) : results?.length ? (
        <div>
          {results.map((result) => (
            <div
              onClick={() => navigate(`/profile/${result.username}`)}
              className="p-2 hover:bg-primary/10 border-b border-borderColor cursor-pointer flex gap-3 rounded-lg"
              key={result.id}
            >
              <img
                src={result.pfp}
                alt=""
                className="w-12 h-12 rounded-full border border-borderColor"
              />
              <div>
                <span className="font-bold text-sky-500 group-hover:underline">
                  {result.name}
                </span>
                <p className="text-sm text-gray-400">@{result.username}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No results for '{searchQuery ?? "()"}'</div>
      )}
    </div>
  );
}
