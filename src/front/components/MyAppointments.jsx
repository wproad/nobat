import {
  myAppointments,
  isUserallowedMoreAppointments,
} from "../utils/data.js";
import AppointmentRow from "./AppointmentRow.jsx";
import EmptyAppointmentsState from "./EmptyAppointmentsState.jsx";

const MyAppointments = () => {
  const appointments = myAppointments || [];
  const hasAppointments = appointments.length > 0;

  // TODO: add loading and error state
  return (
    <div className="my-appointments">
      <div className="appointments-header">
        <h1>نوبت‌های من</h1>
        <div className="header-actions">
          {hasAppointments ? (
            <span className="appointments-count">
              {appointments.length} نوبت
            </span>
          ) : null}
          {isUserallowedMoreAppointments && (
            <button className="book-appointment-btn">رزرو نوبت جدید</button>
          )}
        </div>
      </div>
      {!hasAppointments ? (
        <EmptyAppointmentsState />
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
