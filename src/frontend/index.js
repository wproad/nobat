import "./frontend.scss";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { BookingForm } from "./components";

domReady(() => {
  const root = createRoot(document.getElementById("appointment-booking-form"));

  root.render(<BookingForm />);
});
