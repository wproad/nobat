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
import { useAuth } from "../contexts/AuthContext.js";
import { Card, CardHeader, CardBody } from "../../ui/Card.jsx";
import { __ } from "../../utils/i18n.js";

const Main = ({ scheduleId }) => {
  const { isLoggedIn, loginUrl, registerUrl } = useAuth();
  const [currentView, setCurrentView] = useState("appointments");

  const toggleView = () => {
    setCurrentView(currentView === "appointments" ? "booking" : "appointments");
  };

  // Check if user is logged in
  if (!isLoggedIn) {
    return <LoginRequired loginUrl={loginUrl} registerUrl={registerUrl} />;
  }

  // Determine header text based on current view
  const headerTitle =
    currentView === "appointments"
      ? __("My Appointments", "nobat")
      : __("Book an Appointment", "nobat");

  const buttonText =
    currentView === "appointments"
      ? __("Book New Appointment", "nobat")
      : __("View My Appointments", "nobat");

  return (
    <div className="main-container">
      <div className="main-content">
        <Card className="main-card">
          <CardHeader className="main-header">
            <h1>{headerTitle}</h1>
            <div className="header-actions">
              <button className="toggle-view-btn" onClick={toggleView}>
                {buttonText}
              </button>
            </div>
          </CardHeader>

          <CardBody>
            {currentView === "appointments" ? (
              <MyAppointments />
            ) : (
              <BookingView scheduleId={scheduleId} />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Main;
