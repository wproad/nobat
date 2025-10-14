import { __ } from "@wordpress/i18n";

const DayColumn = ({ day }) => {
  return (
    <div className="day-column">
      <div className="day-header">
        <div className="day-name">{day.formatted_date}</div>
        {/* <div className="appointment-count"> */}
        {/* {(day.slots || []).length} slots */}
        {/* </div> */}
      </div>

      <div className="time-slots">
        {(day.slots || []).map((slot, index) => {
          const label = `${slot.start}-${slot.end}`;
          return (
            <div key={index} className={`time-slot-container`}>
              <div className="time-slot-content">
                <div className="empty-slot">{slot.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { DayColumn };
