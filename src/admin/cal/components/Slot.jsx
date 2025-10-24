import { __ } from "../../../utils/i18n";
import { useState } from "react";
import { Modal, Button } from "../../../components/ui";

const Slot = ({ slot, date, onChangeStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get label and CSS class based on status
  const getSlotInfo = (status) => {
    switch (status) {
      case "booked":
        return { 
          label: __("Booked", "nobat"), 
          className: "slot-booked" 
        };
      case "blocked":
        return { 
          label: __("Blocked", "nobat"), 
          className: "slot-blocked" 
        };
      case "unavailable":
        return { 
          label: __("Unavailable", "nobat"), 
          className: "slot-unavailable" 
        };
      case "available":
      default:
        return { 
          label: __("Available", "nobat"), 
          className: "slot-available" 
        };
    }
  };

  const slotInfo = getSlotInfo(slot?.status || "available");

  const open = () => {
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  const handleStatusChange = async (newStatus) => {
    try {
      if (typeof onChangeStatus === "function") {
        await onChangeStatus(date, `${slot.start}-${slot.end}`, newStatus);
      }
    } finally {
      close();
    }
  };

  // Get available actions based on current status
  const getSlotActions = () => {
    const currentStatus = slot?.status || "available";
    
    const actions = {
      makeAvailable: {
        label: __('Make Available', 'nobat'),
        description: __('Open this slot for booking', 'nobat'),
        status: 'available',
        variant: 'primary',
        icon: '✓'
      },
      block: {
        label: __('Block Slot', 'nobat'),
        description: __('Block this slot (lunch, meeting, etc)', 'nobat'),
        status: 'blocked',
        variant: 'secondary',
        icon: '🚫'
      },
      makeUnavailable: {
        label: __('Make Unavailable', 'nobat'),
        description: __('Mark as outside working hours', 'nobat'),
        status: 'unavailable',
        variant: 'secondary',
        icon: '⏸'
      }
    };
    
    // Return available actions based on current status
    switch (currentStatus) {
      case 'available':
        return [actions.block, actions.makeUnavailable];
      
      case 'blocked':
        return [actions.makeAvailable, actions.makeUnavailable];
      
      case 'unavailable':
        return [actions.makeAvailable, actions.block];
      
      default:
        return [actions.makeAvailable, actions.block, actions.makeUnavailable];
    }
  };

  const slotActions = getSlotActions();

  return (
    <>
      <div 
        className={`empty-slot clickable ${slotInfo.className}`} 
        onClick={open}
      >
        {slotInfo.label}
      </div>
      <Modal
        isOpen={isOpen}
        title={__("Manage Time Slot", "nobat")}
        onRequestClose={close}
        className="slot-status-modal-wrapper"
      >
          <div className="slot-status-modal">
            <div className="slot-info-box">
              <div className="slot-info-label">
                {__("Time Slot:", "nobat")}
              </div>
              <div className="slot-info-time">
                {slot.start} - {slot.end}
              </div>
              <div className="slot-info-status">
                {__("Current Status:", "nobat")} <strong>{slotInfo.label}</strong>
              </div>
            </div>

            {slotActions.length > 0 && (
              <div className="slot-actions-section">
                <h4 className="actions-title">
                  {__('Available Actions', 'nobat')}
                </h4>
                <div className="actions-list">
                  {slotActions.map((action) => (
                    <Button
                      key={action.status}
                      variant={action.variant}
                      onClick={() => handleStatusChange(action.status)}
                      className="slot-action-button"
                    >
                      <div className="action-content">
                        <span className="action-icon">
                          {action.icon}
                        </span>
                        <div className="action-text">
                          <span className="action-label">
                            {action.label}
                          </span>
                          <span className="action-description">
                            {action.description}
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="slot-modal-footer">
              <Button 
                variant="tertiary" 
                onClick={close}
              >
                {__("Close", "nobat")}
              </Button>
            </div>
          </div>
        </Modal>
    </>
  );
};

export { Slot };
