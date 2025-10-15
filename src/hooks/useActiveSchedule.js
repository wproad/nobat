import { useState, useEffect, useCallback } from "@wordpress/element";

/**
 * Custom hook for fetching and managing active schedule data
 * @returns {Object} - { schedule, loading, error, refetch }
 */
export const useActiveSchedule = (scheduleId) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const path = scheduleId
        ? `/wp-json/appointment-booking/v1/schedule/${encodeURIComponent(
            scheduleId
          )}`
        : `/wp-json/appointment-booking/v1/schedule/active`;

      console.log("path", path);

      const response = await fetch(path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Provided by wp_localize_script in admin enqueue
          // "X-WP-Nonce":
          //   typeof wpApiSettings !== "undefined"
          //     ? wpApiSettings.nonce
          //     : undefined,
        },
      });

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
  }, [scheduleId]);

  useEffect(() => {
    fetchActiveSchedule();
  }, [fetchActiveSchedule]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchActiveSchedule,
  };
};
