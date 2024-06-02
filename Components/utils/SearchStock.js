import { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { getUsertoken } from "./localStorageUtils";
import urls from "./urls";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query) => {
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
    debounce((query) => fetchSuggestions(query), 500)
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
