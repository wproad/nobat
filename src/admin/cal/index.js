import "./cal.scss";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { CalendarView } from "./components";

domReady(() => {
  const root = createRoot(document.getElementById("appointment-booking-cal"));

  // Read schedule_id from the current admin page URL if present
  const params = new URL(window.location.href).searchParams;
  const scheduleIdParam = params.get("schedule_id");
  const scheduleId = scheduleIdParam ? Number(scheduleIdParam) : undefined;

  root.render(<CalendarView scheduleId={scheduleId} />);
});
