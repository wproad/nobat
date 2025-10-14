import { useState, useEffect, useCallback } from "@wordpress/element";

/**
 * Custom hook for fetching and managing active schedule data
 * @returns {Object} - { schedule, loading, error, refetch }
 */
export const useActiveSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/wp-json/appointment-booking/v1/schedule/active`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "No active schedule found. Please contact the administrator."
          );
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch active schedule");
      }

      const data = await response.json();
      setSchedule(data);
    } catch (err) {
      console.error("Error fetching active schedule:", err);
      const errorMessage = err.message || "Failed to load schedule";
      setError(errorMessage);
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSchedule();
  }, []);

  return {
    schedule,
    loading,
    error,
    refetch: fetchActiveSchedule,
  };
};
