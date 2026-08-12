import { __ } from "../../../utils/i18n";
import { useState } from "react";
import { Modal, Button } from "../../../ui";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

const CalendarView = () => {
  const [activeStatus, setActiveStatus] = useState(null);

  const statusInfo = {
    available: {
      title: __("Available", "nobat"),
      swatchClass: "slot-available",
      description: __("Open time slots that users can book", "nobat"),
      details: __(
        "These slots are within your working hours and ready for booking. Users can select and book these times.",
        "nobat"
      ),
      example: __(
        "Example: Monday 9:00 AM - 10:00 AM is available for booking",
        "nobat"
      ),
    },
    booked: {
      title: __("Booked", "nobat"),
      swatchClass: "slot-booked",
      description: __("Time slot has an active appointment", "nobat"),
      details: __(
        "A user has booked this time slot. Click on a booked slot to view appointment details, contact information, and manage the appointment.",
        "nobat"
      ),
      example: __(
        "Example: Monday 10:00 AM - 11:00 AM is booked by John Doe",
        "nobat"
      ),
    },
    blocked: {
      title: __("Blocked", "nobat"),
      swatchClass: "slot-blocked",
      description: __("Manually blocked by admin", "nobat"),
      details: __(
        "These slots are within working hours but you've manually disabled them. Users cannot book blocked slots. Use this for lunch breaks, meetings, or temporary closures.",
        "nobat"
      ),
      example: __(
        "Example: Block 12:00 PM - 1:00 PM for lunch break",
        "nobat"
      ),
    },
    unavailable: {
      title: __("Unavailable", "nobat"),
      swatchClass: "slot-unavailable",
      description: __("Outside working hours", "nobat"),
      details: __(
        "These time slots are not part of your defined schedule. They appear as placeholders in the calendar but cannot be booked or modified.",
        "nobat"
      ),
      example: __(
        "Example: If schedule is 9 AM - 5 PM, then 8 AM is unavailable",
        "nobat"
      ),
    },
  };

  const handleLegendClick = (status) => {
    setActiveStatus(status);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <CalendarHeader />
      </div>

      <div className="calendar-legend">
        <div className="legend-items">
          {["available", "booked", "blocked", "unavailable"].map((key) => (
            <div
              key={key}
              className="legend-item clickable"
              onClick={() => handleLegendClick(key)}
              title={__("Click for details", "nobat")}
            >
              <span className={`legend-color ${statusInfo[key].swatchClass}`} />
              <span className="legend-label">{statusInfo[key].title}</span>
              <span className="legend-info-icon" aria-hidden="true">
                i
              </span>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!activeStatus}
        title={activeStatus ? statusInfo[activeStatus].title : ""}
        onRequestClose={() => setActiveStatus(null)}
        className="status-info-modal"
      >
        {activeStatus && (
          <div className="status-modal-content">
            <div className="status-color-preview">
              <span
                className={`color-box ${statusInfo[activeStatus].swatchClass}`}
              />
              <span className="status-name">
                {statusInfo[activeStatus].title}
              </span>
            </div>

            <div className="status-section">
              <h4>{__("Description", "nobat")}</h4>
              <p>{statusInfo[activeStatus].description}</p>
            </div>

            <div className="status-section">
              <h4>{__("Details", "nobat")}</h4>
              <p>{statusInfo[activeStatus].details}</p>
            </div>

            <div className="status-section example">
              <h4>{__("Example", "nobat")}</h4>
              <p>{statusInfo[activeStatus].example}</p>
            </div>

            <div className="modal-actions">
              <Button variant="primary" onClick={() => setActiveStatus(null)}>
                {__("Got it", "nobat")}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <CalendarGrid />
    </div>
  );
};

export { CalendarView };
