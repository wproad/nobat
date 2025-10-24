import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { Modal, Button } from "@wordpress/components";

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
      {isOpen && (
        <Modal
          title={__("Manage Time Slot", "nobat")}
          onRequestClose={close}
        >
          <div className="slot-status-modal">
            <div style={{ 
              marginBottom: 20,
              padding: 12,
              backgroundColor: '#f3f4f6',
              borderRadius: 6
            }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                {__("Time Slot:", "nobat")}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
                {slot.start} - {slot.end}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                {__("Current Status:", "nobat")} <strong>{slotInfo.label}</strong>
              </div>
            </div>

            {slotActions.length > 0 && (
              <div>
                <h4 style={{ 
                  marginBottom: 12, 
                  fontSize: 14, 
                  fontWeight: 600,
                  color: '#374151',
                  letterSpacing: '0.025em'
                }}>
                  {__('Available Actions', 'nobat')}
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  {slotActions.map((action) => (
                    <Button
                      key={action.status}
                      variant={action.variant}
                      onClick={() => handleStatusChange(action.status)}
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        height: 'auto',
                        padding: '12px 16px',
                        textAlign: 'left',
                        whiteSpace: 'normal'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <span style={{ 
                          fontSize: '18px',
                          marginRight: 12,
                          minWidth: '24px',
                          textAlign: 'center'
                        }}>
                          {action.icon}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: 600,
                            fontSize: '14px',
                            marginBottom: '2px'
                          }}>
                            {action.label}
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            opacity: 0.8,
                            lineHeight: 1.4
                          }}>
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid #e5e7eb'
            }}>
              <Button 
                variant="tertiary" 
                onClick={close}
                style={{ width: '100%' }}
              >
                {__("Close", "nobat")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export { Slot };
