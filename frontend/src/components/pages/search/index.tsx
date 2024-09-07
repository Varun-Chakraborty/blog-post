import api from "@/api";
import { InfiniteLoader } from "@/components/loaders";
import { SearchBar } from "@/components/searchBar";
import { cn } from "@/lib/utils";
import { APIResponseTypes } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Search({ className }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const newSearchQuery = new URLSearchParams(window.location.search).get("q");
  const [results, setResults] = useState<APIResponseTypes.SearchResult[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"users" | "posts">("users");
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (newSearchQuery !== searchQuery) {
        setLoading(true);
        setSearchQuery(newSearchQuery!);
        (async function () {
          try {
            await api.search(newSearchQuery!).then((searchResults) => {
              setResults(searchResults?.users || []);
            });
          } finally {
            setLoading(false);
          }
        })();
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
      setLoading(false);
    };
  }, [newSearchQuery]);
  return (
    <div className={cn("h-full w-full box-border", className)}>
      <div className="flex justify-center w-full">
        <SearchBar full className="sm:hidden mb-4" />
      </div>
      <div className="w-full flex border-b">
        <div
          onClick={() => setType("users")}
          className={cn(
            "w-full text-center p-2 cursor-pointer hover:bg-primary/10 rounded-t",
            { "border-b-2": type === "users" }
          )}
        >
          User
        </div>
        <div
          onClick={() => setType("posts")}
          className={cn(
            "w-full text-center p-2 cursor-pointer hover:bg-primary/10 rounded-t",
            { "border-b-2": type === "posts" }
          )}
        >
          Post
        </div>
      </div>
      <div className="p-4">
        {results.map((result) => (
          <div
            onClick={() => navigate(`/profile/${result.username}`)}
            className="p-3 hover:bg-primary/10 border-b border-borderColor cursor-pointer flex gap-3 rounded-lg"
            key={result.id}
          >
            <img
              src={result.pfp || "/placeholder-user.jpg"}
              alt=""
              className="w-10 h-10 rounded-full border border-borderColor"
            />
            <div>
              <span className="font-bold text-accent group-hover:underline">
                {result.name}
              </span>
              <p className="text-sm text-gray-400">@{result.username}</p>
            </div>
          </div>
        ))}
        {loading ? (
          <InfiniteLoader />
        ) : (
          !results.length && <p>No {type} found</p>
        )}
      </div>
    </div>
  );
}
