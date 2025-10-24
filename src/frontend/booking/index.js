import "./frontend.scss";
import "../../components/ui/ui-components.scss";
import domReady from "../../utils/dom-ready";
import { createRoot } from "react-dom/client";
import { TabbedBookingView } from "./components";

domReady(() => {
  // Find all booking form containers (multiple shortcodes can exist on one page)
  const containers = document.querySelectorAll('.nobat-booking-container');
  
  if (containers.length === 0) {
    console.warn('Nobat: No booking form containers found on page');
    return;
  }
  
  // Initialize each booking form
  containers.forEach((container) => {
    const appContainer = container.querySelector('.nobat-booking-app');
    
    if (!appContainer) {
      console.warn('Nobat: Booking app container not found', container);
      return;
    }
    
    // Get schedule ID from data attribute
    const scheduleId = container.dataset.scheduleId || '';
    
    console.log('Nobat: Initializing booking form', { scheduleId });
    
    // Create React root and render
    const root = createRoot(appContainer);
    root.render(<TabbedBookingView scheduleId={scheduleId} />);
  });
});
