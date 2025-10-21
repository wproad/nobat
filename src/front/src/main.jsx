import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Function to initialize the React app
function initApp(containerId = "root") {
  const container = document.getElementById(containerId);
  if (container) {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

// Auto-initialize if running standalone
if (document.getElementById("root")) {
  initApp("root");
}

// Export for WordPress integration
window.AppointmentBookingApp = {
  init: initApp,
};
