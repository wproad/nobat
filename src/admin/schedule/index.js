import "./schedule.scss";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { ScheduleTemp } from "./components";

domReady(() => {
  const root = createRoot(
    document.getElementById("appointment-booking-scheduling")
  );

  root.render(<ScheduleTemp />);
});
