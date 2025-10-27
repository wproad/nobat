import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for making HTTP requests with loading states, error handling, and caching
 * @param {string|Function} url - URL string or function that returns URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {Object} config - Hook configuration options
 * @returns {Object} - { data, loading, error, refetch, abort }
 */
export const useFetch = (url, options = {}, config = {}) => {
  const {
    immediate = true, // Execute request immediately
    cache = false, // Enable caching
    retry = 0, // Number of retry attempts
    retryDelay = 1000, // Delay between retries (ms)
    timeout = 0, // Request timeout (ms)
    onSuccess = null, // Success callback
    onError = null, // Error callback
    dependencies = [], // Dependencies for useEffect
    transform = null, // Data transformation function
    validate = null, // Response validation function
  } = config;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const timeoutRef = useRef(null);

  // Generate cache key
  const getCacheKey = useCallback((url, options) => {
    return `${url}_${JSON.stringify(options)}`;
  }, []);

  // Clear timeout
  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Abort request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearTimeout();
  }, [clearTimeout]);

  // Execute fetch request
  const executeRequest = useCallback(
    async (urlToFetch, requestOptions = {}) => {
      // Check cache first
      if (cache) {
        const cacheKey = getCacheKey(urlToFetch, requestOptions);
        const cachedData = cacheRef.current.get(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          setError(null);
          return cachedData;
        }
      }

      // Abort previous request
      abort();

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setError(null);

      try {
        // Set up timeout if specified
        if (timeout > 0) {
          timeoutRef.current = setTimeout(() => {
            abortControllerRef.current?.abort();
          }, timeout);
        }

        // Make the request
        const response = await fetch(urlToFetch, {
          ...options,
          ...requestOptions,
          signal,
        });

        // Clear timeout
        clearTimeout();

        // Check if request was aborted
        if (signal.aborted) {
          throw new Error("Request was aborted");
        }

        // Check response status
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Parse response
        let responseData;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // Validate response if validator provided
        if (validate && !validate(responseData)) {
          throw new Error("Response validation failed");
        }

        // Transform data if transformer provided
        const finalData = transform ? transform(responseData) : responseData;

        // Cache the result
        if (cache) {
          const cacheKey = getCacheKey(urlToFetch, requestOptions);
          cacheRef.current.set(cacheKey, finalData);
        }

        setData(finalData);
        setError(null);
        setRetryCount(0);

        // Call success callback
        if (onSuccess) {
          onSuccess(finalData, response);
        }

        return finalData;
      } catch (err) {
        clearTimeout();

        // Don't set error for aborted requests
        if (
          err.name === "AbortError" ||
          err.message === "Request was aborted"
        ) {
          return;
        }

        const errorMessage = err.message || "An error occurred";
        setError(errorMessage);

        // Call error callback
        if (onError) {
          onError(err);
        }

        // Retry logic
        if (retry > 0 && retryCount < retry) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            executeRequest(urlToFetch, requestOptions);
          }, retryDelay);
        }

        throw err;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      options,
      cache,
      getCacheKey,
      timeout,
      retry,
      retryCount,
      retryDelay,
      transform,
      validate,
      onSuccess,
      onError,
      abort,
      clearTimeout,
    ]
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
    if (!immediate) return;

    const urlToFetch = typeof url === "function" ? url() : url;
    if (!urlToFetch) return;

    executeRequest(urlToFetch);

    // Cleanup on unmount
    return () => {
      abort();
    };
  }, [immediate, url, executeRequest, abort, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
      clearTimeout();
    };
  }, [abort, clearTimeout]);

  return {
    data,
    loading,
    error,
    refetch,
    abort,
    retryCount,
    isRetrying: retryCount > 0,
  };
};

/**
 * Hook for GET requests
 */
export const useGet = (url, config = {}) => {
  return useFetch(url, { method: "GET" }, config);
};

/**
 * Hook for POST requests
 */
export const usePost = (url, body, config = {}) => {
  return useFetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    config
  );
};

/**
 * Hook for PUT requests
 */
export const usePut = (url, body, config = {}) => {
  return useFetch(
    url,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    config
  );
};

/**
 * Hook for DELETE requests
 */
export const useDelete = (url, config = {}) => {
  return useFetch(url, { method: "DELETE" }, config);
};

export default useFetch;
