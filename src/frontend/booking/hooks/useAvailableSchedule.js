import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for fetching schedule with available slots (v2 API)
 * @param {string|number} scheduleId - Optional schedule ID. If not provided, fetches active schedule
 * @returns {Object} - { schedule, loading, error, refetch }
 */
export const useAvailableSchedule = (scheduleId = null) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Frontend booking always uses active schedule (scheduleId ignored for security)
      // Only admin can view specific schedules via /schedules/{id}
      const endpoint = '/wp-json/nobat/v2/schedules/active';

      console.log('Nobat: Fetching active schedule from', endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "No active schedule found. Please contact the administrator."
          );
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch schedule");
      }

      const data = await response.json();
      console.log('Nobat: Schedule data received', data);
      
      // v2 API returns { success: true, schedule: {...} }
      if (data.success && data.schedule) {
        // Transform timeslots to days for component compatibility
        const timeslots = data.schedule.timeslots || [];
        const days = timeslots.map(day => ({
          ...day,
          slots: (day.slots || []).map(slot => ({
            ...slot,
            start_time: slot.start || slot.start_time, // Handle both formats
            end_time: slot.end || slot.end_time
          }))
        }));
        
        const schedule = {
          ...data.schedule,
          days: days
        };
        delete schedule.timeslots; // Remove old property
        
        console.log('Nobat: Transformed schedule', schedule);
        setSchedule(schedule);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
      const errorMessage = err.message || "Failed to load schedule";
      setError(errorMessage);
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - always fetches active schedule

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule,
  };
};
