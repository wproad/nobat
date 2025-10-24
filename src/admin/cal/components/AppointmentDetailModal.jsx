import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
  Button,
  SelectControl,
  Modal,
  TextControl,
  TextareaControl,
} from "@wordpress/components";
import apiFetch from "@wordpress/api-fetch";
import {
  getStatusColor,
  getStatusLabel,
  statusOptions,
  formatDate,
  generateWhatsAppLink,
  getDefaultWhatsAppMessage,
} from "../../../lib/appointmentUtils";
import { gregorianToJalali } from "../../../lib/dateConverter";

const AppointmentDetailModal = ({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [report, setReport] = useState(appointment?.report || "");
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);
  const [isEditingReport, setIsEditingReport] = useState(!appointment?.report);

  if (!appointment) return null;

  const handleWhatsAppClick = () => {
    const timeSlot = `${appointment.start_time.substring(0, 5)}-${appointment.end_time.substring(0, 5)}`;
    const message = getDefaultWhatsAppMessage({
      ...appointment,
      client_name: appointment.user_name,
      client_phone: appointment.user_phone,
      appointment_date: appointment.slot_date,
      time_slot: timeSlot
    });
    const whatsappLink = generateWhatsAppLink(appointment.user_phone, message);
    window.open(whatsappLink, "_blank");
  };

  const handleStatusChange = async (newStatus) => {
    const success = await onStatusUpdate(appointment.id, newStatus);
    // Modal will refresh automatically when appointment data updates
  };

  const handleDelete = async () => {
    const success = await onDelete(appointment.id);
    if (success) {
      setShowDeleteModal(false);
      onClose();
    }
  };

  const handleSaveReport = async () => {
    setIsSavingReport(true);
    setReportMessage(null);

    try {
      await apiFetch({
        path: `/nobat/v2/appointments/${appointment.id}/report`,
        method: "PUT",
        data: { report },
      });

      setReportMessage({
        type: "success",
        text: __("Report saved successfully!", "nobat"),
      });

      // Exit edit mode after saving
      setIsEditingReport(false);

      // Clear message after 3 seconds
      setTimeout(() => setReportMessage(null), 3000);
    } catch (error) {
      setReportMessage({
        type: "error",
        text: error.message || __("Failed to save report", "nobat"),
      });
    } finally {
      setIsSavingReport(false);
    }
  };

  // Get available actions based on current status
  const getStatusActions = () => {
    const currentStatus = appointment.status;
    
    // Define all possible status transition actions
    const statusActions = {
      confirm: {
        label: __('Confirm Appointment', 'nobat'),
        description: __('Approve and confirm this appointment', 'nobat'),
        status: 'confirmed',
        variant: 'primary',
        icon: '✓',
        type: 'status'
      },
      complete: {
        label: __('Mark as Completed', 'nobat'),
        description: __('Mark this appointment as successfully completed', 'nobat'),
        status: 'completed',
        variant: 'primary',
        icon: '✓✓',
        type: 'status'
      },
      cancel: {
        label: __('Cancel Appointment', 'nobat'),
        description: __('Cancel this appointment and free the time slot', 'nobat'),
        status: 'cancelled',
        variant: 'secondary',
        isDestructive: true,
        icon: '✕',
        type: 'status'
      },
      restore: {
        label: __('Restore Appointment', 'nobat'),
        description: __('Restore this appointment to confirmed status', 'nobat'),
        status: 'confirmed',
        variant: 'primary',
        icon: '↶',
        type: 'status'
      }
    };
    
    // Common actions available for all statuses
    const commonActions = {
      whatsapp: {
        label: __('Send WhatsApp Message', 'nobat'),
        description: __('Open WhatsApp to message the client', 'nobat'),
        variant: 'secondary',
        icon: '💬',
        type: 'communication',
        className: 'whatsapp-action',
        onClick: handleWhatsAppClick
      },
      delete: {
        label: __('Delete Permanently', 'nobat'),
        description: __('Permanently delete this appointment (cannot be undone)', 'nobat'),
        variant: 'link',
        isDestructive: true,
        icon: null,
        type: 'delete',
        onClick: () => setShowDeleteModal(true)
      }
    };
    
    let actions = [];
    
    // Add status-specific actions
    switch (currentStatus) {
      case 'pending':
        actions = [statusActions.confirm, statusActions.cancel];
        break;
      
      case 'confirmed':
        actions = [statusActions.complete, statusActions.cancel];
        break;
      
      case 'cancel_requested':
        actions = [statusActions.cancel, statusActions.restore];
        break;
      
      case 'completed':
        actions = [statusActions.cancel];
        break;
      
      case 'cancelled':
        actions = [statusActions.restore];
        break;
      
      default:
        actions = [];
    }
    
    // Add common actions to all
    actions.push(commonActions.whatsapp, commonActions.delete);
    
    return actions;
  };

  const allActions = getStatusActions();

  return (
    <>
      {isOpen && (
        <Modal
          title={__("Appointment Details", "nobat")}
          isOpen={isOpen}
          onRequestClose={onClose}
          className="appointment-detail-modal"
        >
          <div className="appointment-detail-content">
            <div className="appointment-info">
              <div className="info-row">
                <strong>{__("Client Name:", "nobat")}</strong>
                <span>
                  {appointment.user_id ? (
                    <a
                      href={`/wp-admin/user-edit.php?user_id=${appointment.user_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="client-name-link"
                    >
                      {appointment.user_name}
                    </a>
                  ) : (
                    appointment.user_name
                  )}
                </span>
              </div>
              <div className="info-row">
                <strong>{__("Phone:", "nobat")}</strong>
                <span className="phone-number">{appointment.user_phone}</span>
              </div>
              <div className="info-row">
                <strong>{__("Date:", "nobat")}</strong>
                <span className="date-value">
                  {gregorianToJalali(appointment.slot_date) || formatDate(appointment.slot_date)}
                </span>
              </div>
              <div className="info-row">
                <strong>{__("Time:", "nobat")}</strong>
                <span className="time-slot">
                  {`${appointment.start_time.substring(0, 5)} - ${appointment.end_time.substring(0, 5)}`}
                </span>
              </div>
            <div className="info-row">
              <strong>{__("Status:", "nobat")}</strong>
              <span
                className="status-badge"
                style={{
                  backgroundColor: getStatusColor(appointment.status),
                }}
              >
                {getStatusLabel(appointment.status)}
              </span>
            </div>
            {appointment.admin_name && (
              <div className="info-row">
                <strong>{__("Assigned Admin:", "nobat")}</strong>
                <span className="admin-name">{appointment.admin_name}</span>
              </div>
            )}
            {appointment.note && (
              <div className="info-row note-row">
                <strong>{__("Note:", "nobat")}</strong>
                <span className="note-content">{appointment.note}</span>
              </div>
            )}
            {appointment.status === 'cancelled' && appointment.cancellation_reason && (
              <div className="info-row cancellation-row">
                <strong>{__("Cancellation Reason:", "nobat")}</strong>
                <span className="cancellation-reason">{appointment.cancellation_reason}</span>
              </div>
            )}
            </div>

            {/* All Action Buttons */}
            {allActions.length > 0 && (
              <div className="appointment-actions" style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: '2px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  marginBottom: 12, 
                  fontSize: 13, 
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
                  {allActions.map((action, index) => (
                    <Button
                      key={action.status || action.type || index}
                      variant={action.variant}
                      isDestructive={action.isDestructive}
                      className={action.className}
                      onClick={action.type === 'status' 
                        ? () => handleStatusChange(action.status)
                        : action.onClick
                      }
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        height: 'auto',
                        padding: '10px 14px',
                        textAlign: 'left',
                        whiteSpace: 'normal'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        {action.icon && (
                          <span style={{ 
                            fontSize: '16px',
                            marginRight: 10,
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>
                            {action.icon}
                          </span>
                        )}
                        <div style={{ flex: 1, marginLeft: action.icon ? 0 : 0 }}>
                          <div style={{ 
                            fontWeight: 600,
                            fontSize: '13px',
                            marginBottom: action.description ? '2px' : 0
                          }}>
                            {action.label}
                          </div>
                          {action.description && (
                            <div style={{ 
                              fontSize: '11px',
                              opacity: 0.75,
                              lineHeight: 1.3
                            }}>
                              {action.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Session Report Section */}
            <div className="appointment-report" style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '2px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <h4 style={{ 
                  fontSize: 14, 
                  fontWeight: 600,
                  color: '#374151',
                  letterSpacing: '0.025em',
                  margin: 0
                }}>
                  {__('Session Report', 'nobat')}
                </h4>
                {!isEditingReport && report && (
                  <Button
                    variant="link"
                    onClick={() => setIsEditingReport(true)}
                    style={{ 
                      fontSize: 13,
                      padding: '4px 8px'
                    }}
                  >
                    {__('Edit', 'nobat')}
                  </Button>
                )}
              </div>
              
              {reportMessage && (
                <div style={{
                  padding: '10px 12px',
                  marginBottom: 12,
                  borderRadius: 6,
                  fontSize: 13,
                  backgroundColor: reportMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: reportMessage.type === 'success' ? '#065f46' : '#991b1b',
                  border: `1px solid ${reportMessage.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
                }}>
                  {reportMessage.text}
                </div>
              )}

              {isEditingReport ? (
                <>
                  <TextareaControl
                    value={report}
                    onChange={setReport}
                    placeholder={__('Add notes, observations, or session summary...', 'nobat')}
                    rows={2}
                    style={{
                      width: '100%',
                      fontSize: 14,
                      lineHeight: 1.5
                    }}
                  />
                  
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 12
                  }}>
                    <Button
                      variant="primary"
                      onClick={handleSaveReport}
                      isBusy={isSavingReport}
                      disabled={isSavingReport}
                      style={{ flex: 1 }}
                    >
                      {isSavingReport ? __('Saving...', 'nobat') : __('Save Report', 'nobat')}
                    </Button>
                    {report && appointment?.report && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setReport(appointment.report || "");
                          setIsEditingReport(false);
                        }}
                        disabled={isSavingReport}
                      >
                        {__('Cancel', 'nobat')}
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#374151',
                  whiteSpace: 'pre-wrap'
                }}>
                  {report || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>{__('No report added yet', 'nobat')}</span>}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          title={__("Delete Appointment", "nobat")}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <p>
            {__(
              "Are you sure you want to delete this appointment? This action cannot be undone.",
              "nobat"
            )}
          </p>
          <div className="modal-actions" style={{
                display: "flex",
                gap: 8,
                marginTop: 16,
                justifyContent: "flex-end",
              }}>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              {__("Cancel", "nobat")}
            </Button>
            <Button variant="primary" isDestructive onClick={handleDelete}>
              {__("Delete", "nobat")}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export { AppointmentDetailModal };
