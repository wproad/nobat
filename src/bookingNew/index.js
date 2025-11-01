import "./bookingNew.scss";
import "../ui/ui-components.scss";
import domReady from "../utils/dom-ready";
import { createRoot } from "react-dom/client";
import Main from "./components/Main";
import { AuthProvider } from "./contexts/AuthContext";

domReady(() => {
  // TODO: later attach it to shortcode's id

  // Create React root and render
  const root = createRoot(document.getElementById("nobat-new"));
  root.render(
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
});
