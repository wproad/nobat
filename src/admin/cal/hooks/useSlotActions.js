// src/admin/cal/hooks/useSlotActions.js
export const useSlotActions = (
  scheduleId,
  { refetchSchedule, refetchAppointments },
  { handleStatusUpdate, handleDelete }
) => {
  const updateSlotStatus = async (date, timeSlot, status) => {
    try {
      const response = await fetch(
        `/wp-json/appointment-booking/v1/schedule/slot`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
          body: JSON.stringify({
            schedule_id: scheduleId,
            date,
            time_slot: timeSlot,
            status,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update slot status");
      await response.json().catch(() => ({}));
      refetchSchedule();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleStatusUpdateWithRefresh = async (id, newStatus) => {
    const ok = await handleStatusUpdate(id, newStatus);
    if (ok) refetchAppointments();
    return ok;
  };

  const handleDeleteWithRefresh = async (id) => {
    const ok = await handleDelete(id);
    if (ok) {
      refetchAppointments();
      refetchSchedule();
    }
    return ok;
  };

  return {
    updateSlotStatus,
    handleStatusUpdateWithRefresh,
    handleDeleteWithRefresh,
  };
};
