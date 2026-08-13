import { __ } from "../../../utils/i18n";
import { useEffect, useRef, useState } from "react";
import { TextControl, Spinner } from "../../../ui";

const UserSearchSelect = ({ selectedUser, onSelect, disabled = false }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const searchUsers = async (value) => {
    if (abortRef.current) abortRef.current.abort();

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/wp-json/nobat/v2/users/search?q=${encodeURIComponent(trimmed)}`,
        {
          headers: {
            "X-WP-Nonce": wpApiSettings.nonce,
          },
          signal: controller.signal,
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message || __("Failed to search users.", "nobat")
        );
      }

      setResults(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setResults([]);
      setError(err.message || __("Failed to search users.", "nobat"));
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(value), 300);
  };

  const handleSelect = (user) => {
    onSelect(user);
    setQuery("");
    setResults([]);
    setError(null);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery("");
    setResults([]);
    setError(null);
  };

  if (selectedUser) {
    return (
      <div className="admin-book-selected-user">
        <div className="admin-book-selected-user__info">
          <strong>{selectedUser.name}</strong>
          <span>{selectedUser.email}</span>
          {selectedUser.phone ? <span>{selectedUser.phone}</span> : null}
        </div>
        <button
          type="button"
          className="admin-book-selected-user__clear"
          onClick={handleClear}
          disabled={disabled}
        >
          {__("Change", "nobat")}
        </button>
      </div>
    );
  }

  return (
    <div className="admin-book-user-search">
      <TextControl
        label={__("Search user", "nobat")}
        value={query}
        onChange={handleQueryChange}
        placeholder={__("Name, email, or phone…", "nobat")}
        disabled={disabled}
        help={__("Type at least 2 characters to search.", "nobat")}
      />

      {loading && (
        <div className="admin-book-user-search__loading">
          <Spinner />
        </div>
      )}

      {error && (
        <p className="admin-book-user-search__error">{error}</p>
      )}

      {!loading && results.length > 0 && (
        <ul className="admin-book-user-search__results">
          {results.map((user) => (
            <li key={user.id}>
              <button
                type="button"
                onClick={() => handleSelect(user)}
                disabled={disabled}
              >
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                {user.phone ? <span>{user.phone}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading &&
        !error &&
        query.trim().length >= 2 &&
        results.length === 0 && (
          <p className="admin-book-user-search__empty">
            {__("No users found.", "nobat")}
          </p>
        )}
    </div>
  );
};

export { UserSearchSelect };
