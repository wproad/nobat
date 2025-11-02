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
import "./bookingNew.scss";
import "../ui/ui-components.scss";
import domReady from "../utils/dom-ready";
import { createRoot } from "react-dom/client";
import Main from "./components/Main";
import { AuthProvider } from "./contexts/AuthContext";

domReady(() => {
  // Find all new booking form containers (multiple shortcodes can exist on one page)
  const containers = document.querySelectorAll(".nobat-new-container");

  if (containers.length === 0) {
    console.warn("Nobat: No new booking form containers found on page");
    return;
  }

  // Initialize each booking form
  containers.forEach((container) => {
    const appContainer = container.querySelector(".nobat-new-app");

    if (!appContainer) {
      console.warn("Nobat: Booking app container not found", container);
      return;
    }

    // Get schedule ID from data attribute
    const scheduleId = container.dataset.scheduleId || "";

    console.log("Nobat: Initializing new booking form", { scheduleId });

    // Create React root and render
    const root = createRoot(appContainer);
    root.render(
      <AuthProvider>
        <Main scheduleId={scheduleId} />
      </AuthProvider>
    );
  });
});
