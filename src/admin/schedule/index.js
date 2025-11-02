import "./schedule.scss";
import "../../ui/ui-components.scss";
import domReady from "../../utils/dom-ready";
import { createRoot } from "react-dom/client";
import { CreateSchedule } from "./components";

domReady(() => {
  const root = createRoot(
    document.getElementById("nobat-scheduling")
  );

  root.render(<CreateSchedule />);
});
