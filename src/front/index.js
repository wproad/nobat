import "./front.scss";
import "../components/ui/ui-components.scss";
import domReady from "../utils/dom-ready";
import { createRoot } from "react-dom/client";
import Main from "./components/Main";

domReady(() => {
  // TODO: later attach it to shortcode's id
  
  // Create React root and render
  const root = createRoot(document.getElementById("nobat-new"));
  root.render(<Main />);
});
