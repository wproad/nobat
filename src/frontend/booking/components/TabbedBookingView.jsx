import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { BookingForm } from "./BookingForm";
import { MyAppointments } from "./MyAppointments";

/**
 * TabbedBookingView component - Shows appointments list with option to book new
 * 1. Default: Show appointments list with "Book New Appointment" button
 * 2. Booking: Show booking form with "Back to My Appointments" button
 */
const TabbedBookingView = ({ scheduleId }) => {
  const [currentView, setCurrentView] = useState("appointments");
  const [hasAppointments, setHasAppointments] = useState(null);

  const handleBookNewClick = () => {
    setCurrentView("booking");
  };

  const handleBackToAppointments = () => {
    setCurrentView("appointments");
  };

  const handleAppointmentsLoaded = (count) => {
    setHasAppointments(count > 0);
    // Auto-switch to booking form if no appointments
    if (count === 0) {
      setCurrentView("booking");
    }
  };

  const handleBookingSuccess = () => {
    // Check if custom success message is configured
    const successMessage = window.nobatBooking?.successMessage || "";
    
    if (!successMessage) {
      // No custom message, redirect to appointments list
      handleBackToAppointments();
    }
    // If there's a custom message, the BookingForm will handle showing it
  };

  return (
    <div className="nobat-booking-view">
      {currentView === "appointments" ? (
        <div className="nobat-form">
          <MyAppointments 
            shouldLoad={true} 
            onBookNew={handleBookNewClick}
            onAppointmentsLoaded={handleAppointmentsLoaded}
          />
        </div>
      ) : (
        <div className="nobat-form">
          <BookingForm 
            scheduleId={scheduleId} 
            onSuccess={handleBookingSuccess}
            onBack={hasAppointments === false ? null : handleBackToAppointments}
          />
        </div>
      )}
    </div>
  );
};

export { TabbedBookingView };

