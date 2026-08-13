import { __ } from "../../../utils/i18n";
import { useId, useState } from "react";
import { Modal, Button } from "../../../ui";
import { getStatusLabel } from "../../../lib/appointmentUtils";

const GUIDE_ITEMS = [
  {
    key: "available",
    swatch: "available",
    title: __("Available", "nobat"),
    help: __("Free time range for booking", "nobat"),
    description: __("Open time slots that users can book", "nobat"),
    details: __(
      "These slots are within your working hours and ready for booking. Users can select and book these times.",
      "nobat"
    ),
  },
  {
    key: "pending",
    swatch: "pending",
    title: getStatusLabel("pending"),
    help: __("Booking registered and awaiting confirmation", "nobat"),
    description: __(
      "New appointment waiting for admin confirmation",
      "nobat"
    ),
    details: __(
      "A user booked this slot and it still needs your approval. Click the slot to confirm, cancel, or contact the client.",
      "nobat"
    ),
  },
  {
    key: "confirmed",
    swatch: "confirmed",
    title: getStatusLabel("confirmed"),
    help: __("Appointment confirmed and finalized", "nobat"),
    description: __("Appointment confirmed by admin", "nobat"),
    details: __(
      "You have confirmed this booking. The client is expected at this time. You can complete or cancel it from the appointment details.",
      "nobat"
    ),
  },
  {
    key: "cancel_requested",
    swatch: "cancel-requested",
    title: getStatusLabel("cancel_requested"),
    help: __(
      "Cancellation request submitted and under review",
      "nobat"
    ),
    description: __(
      "Client requested cancellation; awaiting your decision",
      "nobat"
    ),
    details: __(
      "The client asked to cancel. Review the reason in the appointment details, then approve the cancellation or keep the appointment.",
      "nobat"
    ),
  },
  {
    key: "cancelled",
    swatch: "cancelled",
    title: getStatusLabel("cancelled"),
    help: __("Appointment has been cancelled", "nobat"),
    description: __("Appointment was cancelled", "nobat"),
    details: __(
      "This booking was cancelled by admin or after approving a client request. The time slot can become available again.",
      "nobat"
    ),
  },
  {
    key: "completed",
    swatch: "completed",
    title: getStatusLabel("completed"),
    help: __("Appointment held and finished", "nobat"),
    description: __("Appointment session finished", "nobat"),
    details: __(
      "You marked this appointment as completed after the visit. It remains on the calendar for history.",
      "nobat"
    ),
  },
  {
    key: "blocked",
    swatch: "blocked",
    title: __("Blocked", "nobat"),
    help: __("Blocked by admin and not bookable", "nobat"),
    description: __("Manually blocked by admin", "nobat"),
    details: __(
      "These slots are within working hours but you've manually disabled them. Users cannot book blocked slots. Use this for lunch breaks, meetings, or temporary closures.",
      "nobat"
    ),
  },
  {
    key: "unavailable",
    swatch: "unavailable",
    title: __("Unavailable", "nobat"),
    help: __("Outside working hours or inactive", "nobat"),
    description: __("Outside working hours", "nobat"),
    details: __(
      "These time slots are not part of your defined schedule. They appear as placeholders in the calendar but cannot be booked or modified.",
      "nobat"
    ),
  },
];

const TOGGLE_DOTS = [
  "available",
  "pending",
  "confirmed",
  "cancel-requested",
];

const CalendarGuide = ({ defaultOpen = false }) => {
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [activeKey, setActiveKey] = useState(null);

  const activeItem = GUIDE_ITEMS.find((item) => item.key === activeKey);

  return (
    <>
      <div className="bf-legend" data-open={open ? "true" : "false"}>
        <button
          type="button"
          className="bf-legend__toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="bf-legend__toggle-meta">
            <span className="bf-legend__toggle-dots" aria-hidden="true">
              {TOGGLE_DOTS.map((swatch) => (
                <span
                  key={swatch}
                  className={`bf-legend__dot bf-legend__dot--${swatch}`}
                />
              ))}
            </span>
            <span className="bf-legend__toggle-label">
              {__("Status guide", "nobat")}
            </span>
          </span>
          <svg
            className="bf-legend__chevron"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6.5L8 10.5L12 6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className="bf-legend__panel"
          id={panelId}
          role="region"
          aria-label={__("Calendar status list", "nobat")}
          hidden={!open}
        >
          <ul className="bf-legend__list">
            {GUIDE_ITEMS.map((item) => (
              <li
                key={item.key}
                className={`bf-legend__item bf-legend__item--${item.swatch}`}
              >
                <span className="bf-legend__label">{item.title}</span>
                <button
                  type="button"
                  className="bf-legend__info"
                  title={item.help}
                  aria-label={`${__("About", "nobat")}: ${item.title}`}
                  onClick={() => setActiveKey(item.key)}
                >
                  i
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={!!activeItem}
        title={activeItem ? activeItem.title : ""}
        onRequestClose={() => setActiveKey(null)}
        className="status-info-modal"
      >
        {activeItem && (
          <div className="status-modal-content">
            <div className="status-color-preview">
            
              <span className="status-name">{activeItem.title}</span>
            </div>

            <div className="status-section">
              <h4>{__("Description", "nobat")}</h4>
              <p>{activeItem.description}</p>
            </div>

            <div className="status-section">
              <h4>{__("Details", "nobat")}</h4>
              <p>{activeItem.details}</p>
            </div>

            <div className="modal-actions">
              <Button variant="primary" onClick={() => setActiveKey(null)}>
                {__("Got it", "nobat")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export { CalendarGuide };
