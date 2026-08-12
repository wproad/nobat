/**
 * MyAppointments Component
 *
 * Soft Slot tabs + appointment cards for upcoming / cancelled / past.
 * Supports switching into a single AppointmentTicket view with back navigation.
 */
import { useState } from "react";
import { useGet } from "../hooks/useFetch.js";
import { categorizeAppointments } from "../utils/appointmentHelpers.js";
import AppointmentRow from "./AppointmentRow.jsx";
import AppointmentTicket from "./AppointmentTicket.jsx";
import EmptyAppointmentsState from "./EmptyAppointmentsState.jsx";
import { Spinner, Notice } from "../../ui/index.js";
import { __ } from "../../utils/i18n.js";

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTicket, setSelectedTicket] = useState(null);

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

  if (selectedTicket) {
    return (
      <AppointmentTicket
        appointment={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        backLabel={__("Back to Appointments", "nobat")}
      />
    );
  }

  return (
    <div>
      {hasAnyAppointments && (
        <div
          className="bf-tabs"
          role="tablist"
          aria-label={__("Filter appointments", "nobat")}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`nobat-tab-${tab.id}`}
              className="bf-tab"
              role="tab"
              aria-selected={activeTab === tab.id ? "true" : "false"}
              aria-controls="nobat-appointment-panel"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="bf-badge bf-badge--count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <section
        id="nobat-appointment-panel"
        role="tabpanel"
        aria-labelledby={`nobat-tab-${activeTab}`}
      >
        {loading ? (
          <div className="bf-loading">
            <Spinner />
            <span>{__("Loading appointments...", "nobat")}</span>
          </div>
        ) : error ? (
          <Notice status="error" isDismissible={false}>
            {error instanceof Error
              ? error.message
              : String(error || __("Failed to load appointments.", "nobat"))}
          </Notice>
        ) : !hasAnyAppointments ? (
          <EmptyAppointmentsState />
        ) : currentAppointments.length === 0 ? (
          <p className="bf-empty__muted">{__("Nothing here!", "nobat")}</p>
        ) : (
          currentAppointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              onShowTicket={setSelectedTicket}
              onCancelled={() => {
                refetch().catch(() => {});
              }}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default MyAppointments;
