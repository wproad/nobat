import "./admin.scss";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { AdminAppointmentsList } from "./components";

domReady(() => {
  const root = createRoot(document.getElementById("appointment-booking-admin"));

  root.render(<AdminAppointmentsList />);
});
