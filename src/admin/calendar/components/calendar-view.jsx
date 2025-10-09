import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { DayColumn } from "./day-column";
import { TimeColumn } from "./time-column";

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [slotTemplate, setSlotTemplate] = useState([]); // array of {label, excluded}
  const [startOfWeekIndex, setStartOfWeekIndex] = useState(6); // 0=Sun..6=Sat; default Sat
  const [slotsError, setSlotsError] = useState(null);
  console.log("CalendarView");
  useEffect(() => {
    fetchAppointments();
  }, [currentWeek]);

  useEffect(() => {
    const fetchSlotTemplate = async () => {
      try {
        setSlotsError(null);
        const response = await fetch(
          "/wp-json/appointment-booking/v1/time-slots-template",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-WP-Nonce": wpApiSettings.nonce,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch time slots template");
        }
        const data = await response.json();
        // Accept both old shape (string[]) and new shape ({label, excluded}[])
        const normalized = Array.isArray(data)
          ? data.map((item) =>
              typeof item === "string" ? { label: item, excluded: false } : item
            )
          : [];
        setSlotTemplate(normalized);
      } catch (e) {
        console.error(e);
        setSlotsError(e.message);
        // fallback to previous hardcoded defaults to ensure calendar renders
        setSlotTemplate(
          [
            "9:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
            "14:00-15:00",
            "15:00-16:00",
            "16:00-17:00",
          ].map((s) => ({ label: s, excluded: false }))
        );
      }
    };
    fetchSlotTemplate();
  }, []);

  // Respect WordPress "Start of week" setting if available
  useEffect(() => {
    const fetchStartOfWeek = async () => {
      try {
        const response = await fetch("/wp-json/wp/v2/settings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch WP settings");
        const settings = await response.json();
        if (
          settings &&
          typeof settings.start_of_week === "number" &&
          settings.start_of_week >= 0 &&
          settings.start_of_week <= 6
        ) {
          setStartOfWeekIndex(settings.start_of_week);
        }
      } catch (e) {
        // Fallback remains Saturday (6)
        // Silently ignore to avoid blocking calendar rendering
        console.warn("Using default start of week (Saturday):", e?.message);
      }
    };
    fetchStartOfWeek();
  }, []);

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
    // Calculate the start of week based on WordPress setting (0=Sun..6=Sat)
    const daysSinceStart = (day - startOfWeekIndex + 7) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceStart);

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
        <TimeColumn timeSlots={slotTemplate} error={slotsError} />
        {weekDates.map((date, index) => (
          <DayColumn
            key={index}
            date={date}
            appointments={getAppointmentsForDate(date)}
            isToday={date.toDateString() === today.toDateString()}
            timeSlots={slotTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export { CalendarView };
