import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { Modal, Button } from "@wordpress/components";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

const CalendarView = () => {
  const [activeStatus, setActiveStatus] = useState(null);

  const statusInfo = {
    available: {
      title: __("Available", "nobat"),
      color: "transparent",
      borderColor: "#4caf50",
      description: __("Open time slots that users can book", "nobat"),
      details: __("These slots are within your working hours and ready for booking. Users can select and book these times.", "nobat"),
      example: __("Example: Monday 9:00 AM - 10:00 AM is available for booking", "nobat"),
    },
    booked: {
      title: __("Booked", "nobat"),
      color: "#4caf50",
      description: __("Time slot has an active appointment", "nobat"),
      details: __("A user has booked this time slot. Click on a booked slot to view appointment details, contact information, and manage the appointment.", "nobat"),
      example: __("Example: Monday 10:00 AM - 11:00 AM is booked by John Doe", "nobat"),
    },
    blocked: {
      title: __("Blocked", "nobat"),
      color: "#f44336",
      description: __("Manually blocked by admin", "nobat"),
      details: __("These slots are within working hours but you've manually disabled them. Users cannot book blocked slots. Use this for lunch breaks, meetings, or temporary closures.", "nobat"),
      example: __("Example: Block 12:00 PM - 1:00 PM for lunch break", "nobat"),
    },
    unavailable: {
      title: __("Unavailable", "nobat"),
      color: "#9e9e9e",
      description: __("Outside working hours", "nobat"),
      details: __("These time slots are not part of your defined schedule. They appear as placeholders in the calendar but cannot be booked or modified.", "nobat"),
      example: __("Example: If schedule is 9 AM - 5 PM, then 8 AM is unavailable", "nobat"),
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
      
      {/* Legend for slot statuses */}
      <div className="calendar-legend">
        <div className="legend-items">
          <div
            className="legend-item clickable"
            onClick={() => handleLegendClick("available")}
            title={__("Click for details", "nobat")}
          >
            <span className="legend-color slot-available"></span>
            <span className="legend-label">{__("Available", "nobat")}</span>
            <span className="legend-info-icon">ⓘ</span>
          </div>
          <div
            className="legend-item clickable"
            onClick={() => handleLegendClick("booked")}
            title={__("Click for details", "nobat")}
          >
            <span className="legend-color slot-booked"></span>
            <span className="legend-label">{__("Booked", "nobat")}</span>
            <span className="legend-info-icon">ⓘ</span>
          </div>
          <div
            className="legend-item clickable"
            onClick={() => handleLegendClick("blocked")}
            title={__("Click for details", "nobat")}
          >
            <span className="legend-color slot-blocked"></span>
            <span className="legend-label">{__("Blocked", "nobat")}</span>
            <span className="legend-info-icon">ⓘ</span>
          </div>
          <div
            className="legend-item clickable"
            onClick={() => handleLegendClick("unavailable")}
            title={__("Click for details", "nobat")}
          >
            <span className="legend-color slot-unavailable"></span>
            <span className="legend-label">{__("Unavailable", "nobat")}</span>
            <span className="legend-info-icon">ⓘ</span>
          </div>
        </div>
      </div>

      {/* Status Info Modal */}
      {activeStatus && (
        <Modal
          title={statusInfo[activeStatus].title}
          onRequestClose={() => setActiveStatus(null)}
          className="status-info-modal"
        >
          <div className="status-modal-content">
            <div className="status-color-preview">
              <span 
                className="color-box"
                style={{
                  backgroundColor: statusInfo[activeStatus].color,
                  border: statusInfo[activeStatus].borderColor 
                    ? `2px solid ${statusInfo[activeStatus].borderColor}` 
                    : '1px solid rgba(0,0,0,0.15)',
                  width: '60px',
                  height: '40px',
                  borderRadius: '6px',
                  display: 'inline-block'
                }}
              ></span>
              <span className="status-name">{statusInfo[activeStatus].title}</span>
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
              <Button 
                variant="primary" 
                onClick={() => setActiveStatus(null)}
              >
                {__("Got it", "nobat")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      <CalendarGrid />
    </div>
  );
};

export { CalendarView };
