/**
 * MyAppointments Component
 *
 * Displays user appointments with categorized tabs (upcoming, cancelled, past).
 * Shows appointment count, handles tab navigation, and renders either the appointments list
 * or an empty state when no appointments exist.
 */
import { useState } from "react";
import { myAppointments } from "../utils/data.js";
import { categorizeAppointments } from "../utils/appointmentHelpers.js";
import AppointmentRow from "./AppointmentRow.jsx";
import EmptyAppointmentsState from "./EmptyAppointmentsState.jsx";
import { Card, CardHeader, CardBody } from "../../components/ui/Card.jsx";
import { __ } from "../../utils/i18n";

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const appointments = myAppointments || [];

  const categorizedAppointments = categorizeAppointments(appointments);

  const currentAppointments = categorizedAppointments[activeTab];
  const totalAppointments = appointments.length;
  const hasAnyAppointments = totalAppointments > 0;

  const tabs = [
    {
      id: "upcoming",
      label: __("Upcoming", "nobat"),
      count: categorizedAppointments.upcoming.length,
    },
    {
      id: "cancelled",
      label: __("Cancelled", "nobat"),
      count: categorizedAppointments.cancelled.length,
    },
    {
      id: "past",
      label: __("Past", "nobat"),
      count: categorizedAppointments.past.length,
    },
  ];

  return (
    <Card className="my-appointments">
      <CardHeader className="appointments-header">
        <h1>{__("My Appointments", "nobat")}</h1>
        <div className="header-actions">
          {totalAppointments > 0 && (
            <span className="appointments-count">
              {totalAppointments} {__("appointments", "nobat")}
            </span>
          )}
        </div>
      </CardHeader>

      {/* Tab Navigation */}
      {hasAnyAppointments && (
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
      )}

      {/* Tab Content */}
      <CardBody className="tab-content">
        {!hasAnyAppointments ? (
          <EmptyAppointmentsState />
        ) : (
          <div className="appointments-list">
            {currentAppointments.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default MyAppointments;
