import { __ } from "../../../utils/i18n";
import { useState } from "react";
import { Button, Notice, TextareaControl } from "../../../ui";
import { UserSearchSelect } from "./UserSearchSelect";

const AdminBookForm = ({
  slot,
  scheduleId,
  onCancel,
  onSuccess,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!selectedUser?.id) {
      setError(__("Please select a user.", "nobat"));
      return;
    }

    if (!slot?.id) {
      setError(__("This time slot cannot be booked.", "nobat"));
      return;
    }

    if (!scheduleId) {
      setError(__("Schedule not found.", "nobat"));
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/wp-json/nobat/v2/appointments/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpApiSettings.nonce,
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          slot_id: parseInt(slot.id, 10),
          schedule_id: parseInt(scheduleId, 10),
          note: note.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message || __("Failed to create appointment.", "nobat")
        );
      }

      if (typeof onSuccess === "function") {
        await onSuccess(data.appointment);
      }
    } catch (err) {
      setError(err.message || __("Failed to create appointment.", "nobat"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-book-form" onSubmit={handleSubmit}>
      <p className="admin-book-form__hint">
        {__("Book this slot for an existing user. The appointment will be confirmed immediately.", "nobat")}
      </p>

      {error && (
        <Notice status="error" className="admin-book-form__notice">
          {error}
        </Notice>
      )}

      <UserSearchSelect
        selectedUser={selectedUser}
        onSelect={setSelectedUser}
        disabled={submitting}
      />

      <TextareaControl
        label={__("Note (optional)", "nobat")}
        value={note}
        onChange={setNote}
        rows={3}
        disabled={submitting}
        placeholder={__("Internal note for this appointment…", "nobat")}
      />

      <div className="admin-book-form__actions">
        <Button
          type="button"
          variant="tertiary"
          onClick={onCancel}
          disabled={submitting}
        >
          {__("Back", "nobat")}
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting
            ? __("Booking…", "nobat")
            : __("Create Appointment", "nobat")}
        </Button>
      </div>
    </form>
  );
};

export { AdminBookForm };
