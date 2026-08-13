/**
 * Booking Application Entry Point
 *
 * Initializes the Nobat booking application by:
 * - Finding all booking form containers on the page (supports multiple shortcodes)
 * - Creating React roots and rendering the Main component
 * - Wrapping each instance with AuthProvider for authentication context
 * - Extracting schedule ID from data attributes
 *
 * This file serves as the DOM-ready initialization script for the booking module.
 */
import "./soft-slot/tokens.css";
import "./soft-slot/booking-form.css";
import "./frontend.scss";
import "../ui/ui-components.scss";
import domReady from "../utils/dom-ready";
import { createRoot } from "react-dom/client";
import Main from "./components/Main";
import { AuthProvider } from "./contexts/AuthContext";

domReady(() => {
  // Find all new booking form containers (multiple shortcodes can exist on one page)
  const containers = document.querySelectorAll(".nobat-new-container");

  if (containers.length === 0) {
    return;
  }

  // Initialize each booking form
  containers.forEach((container) => {
    const appContainer = container.querySelector(".nobat-new-app");

    if (!appContainer) {
      return;
    }

    // Get schedule ID from data attribute
    const scheduleId = container.dataset.scheduleId || "";

    // Create React root and render
    const root = createRoot(appContainer);
    root.render(
      <AuthProvider>
        <Main scheduleId={scheduleId} />
      </AuthProvider>
    );
  });
});
