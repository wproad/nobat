import { __ } from "../../../utils/i18n";

const TimeColumn = ({ timeRows }) => {
  const formatTimeSlot = (timeKey) => {
    // timeKey is like "09:00-10:00"
    const [startTime, endTime] = timeKey.split('-');
    return { startTime: startTime?.trim(), endTime: endTime?.trim() };
  };

  const isOnTheHour = (timeKey) => {
    // Check if the start time ends with :00 (on the hour)
    const [startTime] = timeKey.split('-');
    return startTime?.trim().endsWith(':00');
  };

  return (
    <div className="time-column">
      <div className="time-header">{__("Time", "nobat")}</div>
      {timeRows.map((row, index) => {
        const { startTime, endTime } = formatTimeSlot(row.key);
        const onTheHour = isOnTheHour(row.key);
        return (
          <div 
            key={`slot-${index}`} 
            className={`time-slot ${onTheHour ? 'on-the-hour' : ''}`}
          >
            <div className="time-slot-content">
              <span className="time-start">{startTime}</span>
              <span className="time-separator">—</span>
              <span className="time-end">{endTime}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { TimeColumn };
