import { useState } from "react";
import {
  myAppointments,
  isUserallowedMoreAppointments,
} from "../utils/data.js";
import {
  categorizeAppointments,
} from "../utils/appointmentHelpers.js";
import AppointmentRow from "./AppointmentRow.jsx";
import EmptyAppointmentsState from "./EmptyAppointmentsState.jsx";

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const appointments = myAppointments || [];

  const categorizedAppointments = categorizeAppointments(appointments);

  const currentAppointments = categorizedAppointments[activeTab];
  const hasAppointments = currentAppointments.length > 0;
  const totalAppointments = appointments.length;

  const tabs = [
    {
      id: "upcoming",
      label: "پیش رو",
      count: categorizedAppointments.upcoming.length,
    },
    {
      id: "cancelled",
      label: "لغو شده",
      count: categorizedAppointments.cancelled.length,
    },
    { id: "past", label: "گذشته", count: categorizedAppointments.past.length },
  ];

  return (
    <div className="my-appointments">
      <div className="appointments-header">
        <h1>نوبت‌های من</h1>
        <div className="header-actions">
          {totalAppointments > 0 && (
            <span className="appointments-count">{totalAppointments} نوبت</span>
          )}
          {isUserallowedMoreAppointments && (
            <button className="book-appointment-btn">رزرو نوبت جدید</button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="appointments-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-label">{tab.label}</span>
            {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {!hasAppointments ? (
          <EmptyAppointmentsState />
        ) : (
          <div className="appointments-list">
            {currentAppointments.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
