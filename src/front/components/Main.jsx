import { useState } from "react";
import MyAppointments from "./myAppointments.jsx";
import BookingForm from "./BookingForm.jsx";

const Main = () => {
  const [currentView, setCurrentView] = useState("appointments");

  const toggleView = () => {
    setCurrentView(currentView === "appointments" ? "booking" : "appointments");
  };

  const getButtonText = () => {
    return currentView === "appointments"
      ? "رزرو نوبت جدید"
      : "مشاهده نوبت‌های من";
  };

  return (
    <div className="main-container">
      <div className="main-header">
        <button className="toggle-view-btn" onClick={toggleView}>
          {getButtonText()}
        </button>
      </div>

      <div className="main-content">
        {currentView === "appointments" ? <MyAppointments /> : <BookingForm />}
      </div>
    </div>
  );
};

export default Main;
