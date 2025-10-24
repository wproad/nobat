import { useState, useEffect, useCallback } from "react";

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
        ? `/wp-json/nobat/v2/schedules/${encodeURIComponent(
            scheduleId
          )}`
        : `/wp-json/nobat/v2/schedules/active`;

      console.log("path", path);

      const response = await fetch(path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Provided by wp_localize_script in admin enqueue
          ...(typeof window !== "undefined" &&
            window.location.pathname.includes("/wp-admin/") &&
            typeof wpApiSettings !== "undefined" && {
              "X-WP-Nonce": wpApiSettings.nonce,
            }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch schedule");
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      // Extract schedule from response (API returns { success: true, schedule: {...} })
      const scheduleData = data.schedule || data;
      setSchedule(scheduleData);
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
