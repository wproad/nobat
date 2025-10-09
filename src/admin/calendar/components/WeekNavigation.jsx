import { __ } from "@wordpress/i18n";

const WeekNavigation = ({ isCurrentWeek, onPrev, onToday, onNext }) => {
  return (
    <div className="calendar-navigation">
      <button onClick={onPrev}>
        {__("Previous Week", "appointment-booking")}
      </button>
      <button onClick={onToday} className={isCurrentWeek ? "current-week" : ""}>
        {__("Today", "appointment-booking")}
      </button>
      <button onClick={onNext}>{__("Next Week", "appointment-booking")}</button>
    </div>
  );
};

export { WeekNavigation };
