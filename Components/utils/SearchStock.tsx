import { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { getUsertoken } from "./localStorageUtils";
import urls from "./urls";

interface SuggestionItem {
  exchange: string;
  name: string;
  ticker: string;
}

interface SearchHook {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  suggestions: SuggestionItem[];
}

export const useSearch = (): SearchHook => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  const fetchSuggestions = async (query: string): Promise<void> => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/ticker/search?text=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.searchedList);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useRef(
    debounce((query: string) => fetchSuggestions(query), 500)
  ).current;

  useEffect(() => {
    debouncedFetchSuggestions(query);
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
  };
};
