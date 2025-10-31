/**
 * Main Component
 *
 * Main container component that handles view switching between appointments list and booking form.
 * Checks authentication status and renders either LoginRequired component for unauthenticated users,
 * or the toggle view interface for authenticated users.
 */
import { useState } from "react";
import MyAppointments from "./MyAppointments.jsx";
import BookingView from "./BookingView.jsx";
import LoginRequired from "./LoginRequired.jsx";
import { useAuth } from "../contexts/AuthContext";
import { __ } from "../../utils/i18n";

const Main = () => {
  const { isLoggedIn, loginUrl, registerUrl } = useAuth();
  const [currentView, setCurrentView] = useState("appointments");

  const toggleView = () => {
    setCurrentView(currentView === "appointments" ? "booking" : "appointments");
  };

  const getButtonText = () => {
    return currentView === "appointments"
      ? __("Book New Appointment", "nobat")
      : __("View My Appointments", "nobat");
  };

  // Check if user is logged in
  if (!isLoggedIn) {
    return <LoginRequired loginUrl={loginUrl} registerUrl={registerUrl} />;
  }

  return (
    <div className="main-container">
      <div className="main-header">
        <button className="toggle-view-btn" onClick={toggleView}>
          {getButtonText()}
        </button>
      </div>

      <div className="main-content">
        {currentView === "appointments" ? <MyAppointments /> : <BookingView />}
      </div>
    </div>
  );
};

export default Main;
