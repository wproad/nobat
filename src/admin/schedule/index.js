import "../../bookingNew/soft-slot/tokens.css";
import "../../bookingNew/soft-slot/booking-form.css";
import "../../ui/ui-components.scss";
import "./schedule.scss";
import domReady from "../../utils/dom-ready";
import { createRoot } from "react-dom/client";
import { CreateSchedule } from "./components";

domReady(() => {
  const root = createRoot(
    document.getElementById("nobat-scheduling")
  );

  root.render(<CreateSchedule />);
});
