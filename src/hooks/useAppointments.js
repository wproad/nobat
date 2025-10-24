import { useState, useEffect, useCallback } from "react";

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
        `/wp-json/nobat/v2/appointments/all${params}`,
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
      console.log("📥 Raw API Response:", data);
      // Extract appointments array from response
      const appointments = data.appointments || data;
      console.log("📋 Extracted appointments:", appointments);
      console.log("📊 First appointment sample:", appointments[0]);
      setAppointments(appointments);
    } catch (err) {
      setError(err.message);
      // eslint-disable-next-line no-console
      console.error("❌ Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetch: fetchAppointments };
};
