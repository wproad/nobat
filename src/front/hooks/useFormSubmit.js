import { useState, useCallback } from "react";

export function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // Get WordPress API settings from localized script
  const getApiSettings = useCallback(() => {
    return window.wpApiSettings || {};
  }, []);

  // TODO: don't throw error on 4xx errors, return the error object instead
  const submitForm = async (url, data) => {
    setLoading(true);
    setError(null);

    try {
      // Get WordPress API settings
      const apiSettings = getApiSettings();

      // Normalize the root URL and path to avoid double slashes
      let root = apiSettings.root || "/wp-json";
      root = root.endsWith("/") ? root.slice(0, -1) : root; // Remove trailing slash
      const normalizedPath = url.startsWith("/") ? url : `/${url}`;
      const normalizedUrl = `${root}${normalizedPath}`;

      const res = await fetch(normalizedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": apiSettings.nonce || "",
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        // Handle WordPress error responses
        const errorObj = new Error(json.message || `HTTP Error ${res.status}`);
        errorObj.code = json.code || res.status;
        errorObj.data = json.data || null;
        setError(errorObj);
        throw errorObj;
      }

      setResponse(json);
      return json;
    } catch (err) {
      // Enhanced error handling for network errors
      if (err.message === "Failed to fetch") {
        err.message = "Network error. Please check your connection.";
      }
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error, response };
}
