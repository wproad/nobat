import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { DayColumn } from "./day-column";
import { TimeColumn } from "./time-column";

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  console.log("CalendarView");
  useEffect(() => {
    fetchAppointments();
  }, [currentWeek]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/wp-json/appointment-booking/v1/appointments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      console.log(data);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.appointment_date === dateString);
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <p>{__("Loading calendar...", "appointment-booking")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-error">
        <p>
          {__("Error loading calendar:", "appointment-booking")} {error}
        </p>
        <button onClick={fetchAppointments}>
          {__("Retry", "appointment-booking")}
        </button>
      </div>
    );
  }

  const weekDates = getWeekDates(currentWeek);
  const today = new Date();
  const isCurrentWeek = weekDates.some(
    (date) => date.toDateString() === today.toDateString()
  );

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>{__("Appointment Calendar", "appointment-booking")}</h2>
        <div className="calendar-navigation">
          <button onClick={() => navigateWeek(-1)}>
            {__("Previous Week", "appointment-booking")}
          </button>
          <button
            onClick={goToToday}
            className={isCurrentWeek ? "current-week" : ""}
          >
            {__("Today", "appointment-booking")}
          </button>
          <button onClick={() => navigateWeek(1)}>
            {__("Next Week", "appointment-booking")}
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <TimeColumn />
        {weekDates.map((date, index) => (
          <DayColumn
            key={index}
            date={date}
            appointments={getAppointmentsForDate(date)}
            isToday={date.toDateString() === today.toDateString()}
          />
        ))}
      </div>
    </div>
  );
};

export { CalendarView };
