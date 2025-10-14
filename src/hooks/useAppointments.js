import { useState, useEffect, useCallback } from "@wordpress/element";

export const useAppointments = (scheduleId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = scheduleId
        ? `?schedule_id=${encodeURIComponent(scheduleId)}`
        : "";
      const response = await fetch(
        `/wp-json/appointment-booking/v1/appointments${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
      // eslint-disable-next-line no-console
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetch: fetchAppointments };
};
