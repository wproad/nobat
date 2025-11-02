import "./cal.scss";
import "../../ui/ui-components.scss";
import domReady from "../../utils/dom-ready";
import { createRoot } from "react-dom/client";
import { CalendarView } from "./components";
import { ScheduleProvider } from "../../hooks";

domReady(() => {
  const root = createRoot(document.getElementById("nobat-cal"));

  // Read schedule_id from the current admin page URL if present
  const params = new URL(window.location.href).searchParams;
  const scheduleIdParam = params.get("schedule_id");
  const scheduleId = scheduleIdParam ? Number(scheduleIdParam) : undefined;

  root.render(
    <ScheduleProvider scheduleId={scheduleId}>
      <CalendarView />
    </ScheduleProvider>
  );
});
