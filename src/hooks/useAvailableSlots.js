import { useState, useEffect, useCallback } from "@wordpress/element";

/**
 * Custom hook for managing available time slots
 * @param {string} selectedDate - The date to fetch slots for
 * @returns {Object} - { availableSlots, loading, error, refetch }
 */
export const useAvailableSlots = (selectedDate) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailableSlots = useCallback(async (date) => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/wp-json/appointment-booking/v1/available-slots?date=${date}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }

      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching available slots:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, fetchAvailableSlots]);

  return {
    availableSlots,
    loading,
    error,
    refetch: () => fetchAvailableSlots(selectedDate),
  };
};
