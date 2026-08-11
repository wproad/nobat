/**
 * Main Component
 *
 * Main container component that orchestrates the booking application flow.
 * Handles authentication gate, view switching between appointments list and booking form,
 * and provides Soft Slot header chrome with dynamic action buttons.
 *
 * @param {string} scheduleId - Optional schedule ID for targeted booking
 */
import { useState } from "react";
import MyAppointments from "./MyAppointments.jsx";
import BookingView from "./BookingView.jsx";
import LoginRequired from "./LoginRequired.jsx";
import { useAuth } from "../contexts/AuthContext.js";
import { __ } from "../../utils/i18n";

const Main = ({ scheduleId }) => {
  const { isLoggedIn, loginUrl, registerUrl } = useAuth();
  const [currentView, setCurrentView] = useState("appointments");

  const toggleView = () => {
    setCurrentView(currentView === "appointments" ? "booking" : "appointments");
  };

  if (!isLoggedIn) {
    return <LoginRequired loginUrl={loginUrl} registerUrl={registerUrl} />;
  }

  const headerTitle =
    currentView === "appointments"
      ? __("My Appointments", "nobat")
      : __("Book an Appointment", "nobat");

  const buttonText =
    currentView === "appointments"
      ? __("Book New Appointment", "nobat")
      : __("View My Appointments", "nobat");

  const headerBtnClass =
    currentView === "appointments"
      ? "bf-btn bf-btn--primary"
      : "bf-btn bf-btn--ghost";

  return (
    <div className="bf-shell">
      <header className="bf-header">
        <h1 className="bf-title">{headerTitle}</h1>
        <button type="button" className={headerBtnClass} onClick={toggleView}>
          {buttonText}
        </button>
      </header>

      {currentView === "appointments" ? (
        <MyAppointments />
      ) : (
        <BookingView scheduleId={scheduleId} />
      )}
    </div>
  );
};

export default Main;
