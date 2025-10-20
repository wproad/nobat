import { __ } from "@wordpress/i18n";

const ScheduleNotFound = () => {
  return (
    <div className="calendar-no-schedule">
      <div className="calendar-icon">📅</div>
      <h3>{__("No Schedule Found", "appointment-booking")}</h3>
      <p>
        {__(
          "You need to create a schedule before you can view the calendar.",
          "appointment-booking"
        )}
      </p>
      <a
        href={
          window.location.origin +
          "/wp-admin/admin.php?page=appointment-booking-scheduling"
        }
        className="create-schedule-button"
      >
        {__("Create Your First Schedule Here", "appointment-booking")}
      </a>
    </div>
  );
};

export default ScheduleNotFound;
