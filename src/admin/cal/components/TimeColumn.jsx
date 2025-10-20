import { __ } from "@wordpress/i18n";

const TimeColumn = ({ timeRows }) => {
  return (
    <div className="time-column">
      <div className="time-header">{__("Time", "appointment-booking")}</div>
      {timeRows.map((row, index) => (
        <div key={`slot-${index}`} className="time-slot">
          {row.key}
        </div>
      ))}
    </div>
  );
};

export { TimeColumn };
