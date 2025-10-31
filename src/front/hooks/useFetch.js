import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Custom hook for making HTTP requests with loading states and error handling
 * WordPress-compatible with nonce and proper error handling
 * @param {string|Function} url - URL string or function that returns URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get WordPress API settings from localized script
  const getApiSettings = useCallback(() => {
    return window.wpApiSettings || {};
  }, []);

  // Create a stable executeRequest using useCallback
  const executeRequest = useCallback(
    async (urlToFetch, requestOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        // Get WordPress API settings
        const apiSettings = getApiSettings();

        // Normalize the root URL and path to avoid double slashes
        let root = apiSettings.root || "/wp-json";
        root = root.endsWith("/") ? root.slice(0, -1) : root; // Remove trailing slash
        const normalizedPath = urlToFetch.startsWith("/")
          ? urlToFetch
          : `/${urlToFetch}`;
        const normalizedUrl = `${root}${normalizedPath}`;

        // Build fetch options with WordPress headers
        const fetchOptions = {
          ...options,
          ...requestOptions,
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": apiSettings.nonce || "",
            ...options.headers,
            ...requestOptions.headers,
          },
          credentials: "same-origin",
        };

        // Handle body for POST/PUT/PATCH requests
        if (fetchOptions.body && typeof fetchOptions.body === "object") {
          fetchOptions.body = JSON.stringify(fetchOptions.body);
        }

        const response = await fetch(normalizedUrl, fetchOptions);

        if (!response.ok) {
          // Handle WordPress error responses
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(
            errorData.message || `HTTP Error ${response.status}`
          );
          error.code = errorData.code || response.status;
          error.data = errorData.data || null;
          throw error;
        }

        // Handle empty responses
        const contentType = response.headers.get("content-type");
        let responseData;

        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        setData(responseData);
        setError(null);
        return responseData;
      } catch (err) {
        // Enhanced error handling for network errors
        if (err.message === "Failed to fetch") {
          err.message = "Network error. Please check your connection.";
        }
        const errorMessage = err.message || "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getApiSettings, options]
  );

  // Refetch function
  const refetch = useCallback(
    (newOptions = {}) => {
      const urlToFetch = typeof url === "function" ? url() : url;
      return executeRequest(urlToFetch, newOptions);
    },
    [url, executeRequest]
  );

  // Main effect
  useEffect(() => {
    console.log("useFetch: ", url);

    const urlToFetch = typeof url === "function" ? url() : url;
    if (!urlToFetch) return;

    executeRequest(urlToFetch);
  }, [url, executeRequest]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for GET requests
 */
export const useGet = (url) => {
  const getOptions = useMemo(() => ({ method: "GET" }), []);
  return useFetch(url, getOptions);
};

/**
 * Hook for POST requests
 */
export const usePost = (url, body) => {
  const postOptions = useMemo(
    () => ({
      method: "POST",
      body: body, // Will be JSON stringified automatically
    }),
    [body]
  );
  return useFetch(url, postOptions);
};

/**
 * Hook for PUT requests
 */
export const usePut = (url, body) => {
  const putOptions = useMemo(
    () => ({
      method: "PUT",
      body: body, // Will be JSON stringified automatically
    }),
    [body]
  );
  return useFetch(url, putOptions);
};

/**
 * Hook for DELETE requests
 */
export const useDelete = (url) => {
  const deleteOptions = useMemo(() => ({ method: "DELETE" }), []);
  return useFetch(url, deleteOptions);
};

export default useFetch;
