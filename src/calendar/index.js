import "./calendar.scss";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { CalendarView } from "./components";

domReady(() => {
  console.log("Calendar");
  const root = createRoot(
    document.getElementById("appointment-booking-calendar")
  );

  root.render(<CalendarView />);
});

