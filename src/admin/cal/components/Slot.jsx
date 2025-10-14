import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { Modal, SelectControl, Button } from "@wordpress/components";

const Slot = ({ slot, date, onChangeStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(slot?.status || "available");

  const label =
    slot?.status === "unavailable"
      ? __("unavailable", "appointment-booking")
      : slot?.status || "";

  const open = () => {
    setNewStatus(slot?.status || "available");
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  const handleSave = async () => {
    try {
      if (typeof onChangeStatus === "function") {
        await onChangeStatus(date, `${slot.start}-${slot.end}`, newStatus);
      }
    } finally {
      close();
    }
  };

  return (
    <>
      <div className="empty-slot clickable" onClick={open}>
        {label}
      </div>
      {isOpen && (
        <Modal
          title={__("Update Slot Status", "appointment-booking")}
          onRequestClose={close}
        >
          <div className="slot-status-modal">
            <div style={{ marginBottom: 12 }}>
              <strong>
                {__("Time:", "appointment-booking")} {slot.start}-{slot.end}
              </strong>
            </div>
            <SelectControl
              label={__("Status", "appointment-booking")}
              value={newStatus}
              options={[
                {
                  label: __("available", "appointment-booking"),
                  value: "available",
                },
                {
                  label: __("unavailable", "appointment-booking"),
                  value: "unavailable",
                },
              ]}
              onChange={(value) => setNewStatus(value)}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <Button variant="secondary" onClick={close}>
                {__("Cancel", "appointment-booking")}
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {__("Save", "appointment-booking")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export { Slot };
