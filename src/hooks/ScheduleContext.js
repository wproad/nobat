import { createContext, useContext } from "@wordpress/element";
import { useActiveSchedule } from "./useActiveSchedule";

const ScheduleContext = createContext(null);

export const ScheduleProvider = ({ scheduleId, children }) => {
  const scheduleState = useActiveSchedule(scheduleId);
  return (
    <ScheduleContext.Provider value={scheduleState}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return ctx;
};
