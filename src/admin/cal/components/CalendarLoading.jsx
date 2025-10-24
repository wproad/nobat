import { __ } from "../../../utils/i18n";

export default function CalendarLoading() {
  return (
    <div className="calendar-loading">
      <p>{__("Loading calendar...", "nobat")}</p>
    </div>
  );
}