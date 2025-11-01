/**
 * MyAppointments Component
 *
 * Displays user appointments with categorized tabs (upcoming, cancelled, past).
 * Shows appointment count, handles tab navigation, and renders either the appointments list
 * or an empty state when no appointments exist.
 */
import { useState } from "react";
import { useGet } from "../hooks/useFetch.js";
import { categorizeAppointments } from "../utils/appointmentHelpers.js";
import AppointmentRow from "./AppointmentRow.jsx";
import EmptyAppointmentsState from "./EmptyAppointmentsState.jsx";
import { Card, CardHeader, CardBody } from "../../components/ui/Card.jsx";
import { Spinner, Notice } from "../../components/ui";
import { __ } from "../../utils/i18n";

// TODO: repalce Notic with useNotice hook

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch appointments from API
  const {
    data: appointmentsData,
    loading,
    error,
    refetch,
  } = useGet("/nobat/v2/appointments");

  const appointments = appointmentsData?.appointments || [];
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
        {loading ? (
          <div className="loading-appointments">
            <Spinner />
            <span>{__("Loading appointments...", "nobat")}</span>
          </div>
        ) : error ? (
          <Notice status="error" isDismissible={false}>
            {error}
          </Notice>
        ) : !hasAnyAppointments ? (
          <EmptyAppointmentsState />
        ) : (
          <div className="appointments-list">
            {currentAppointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                onCancelled={() => {
                  // Refetch appointments after cancellation
                  refetch();
                }}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default MyAppointments;
