import { useState, useCallback } from "react";

export const useAppointmentManagement = () => {
  const [error, setError] = useState(null);

  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    try {
      setError(null);
      const response = await fetch(
        `/wp-json/nobat/v2/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      return true;
    } catch (err) {
      setError("Failed to update appointment status");
      console.error("Error updating appointment status:", err);
      return false;
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      setError(null);
      const response = await fetch(
        `/wp-json/nobat/v2/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            "X-WP-Nonce": wpApiSettings.nonce,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      return true;
    } catch (err) {
      setError("Failed to delete appointment");
      console.error("Error deleting appointment:", err);
      return false;
    }
  }, []);

  return {
    handleStatusUpdate,
    handleDelete,
    error,
  };
};
