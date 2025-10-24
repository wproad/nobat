import "./schedule.scss";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { CreateSchedule } from "./components";

domReady(() => {
  const root = createRoot(
    document.getElementById("nobat-scheduling")
  );

  root.render(<CreateSchedule />);
});
