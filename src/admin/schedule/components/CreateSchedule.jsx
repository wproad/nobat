import { useState, useEffect } from "@wordpress/element";
import {
  TextControl,
  ToggleControl,
  Button,
  SelectControl,
  Notice,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { defaultWeeklyHours, weekdays } from "../../../lib/constants";
import { WeeklyHoursEditor } from "./WeeklyHoursEditor";
import { useSchedule } from "../../../hooks/useSchedule";

function CreateSchedule() {
  // TODO: remove in prod
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(30);
  // const [buffer, setBuffer] = useState(0);
  const buffer = 0;

  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(defaultWeeklyHours);

  const { adminUsers, notice, setNotice, saveSchedule } = useSchedule();

  const handleSubmit = () => {
    const payload = {
      name,
      isActive,
      startDay,
      endDay,
      meetingDuration,
      buffer,
      selectedAdmin,
      weeklyHours,
    };
    saveSchedule(payload);
  };

  useEffect(() => {
    // Ensure the script is loaded and global object is available
    if (window.jalaliDatepicker) {
      // Initialize all date inputs
      jalaliDatepicker.startWatch({
        minDate: "today",
        autoReadOnlyInput: true,
        format: "YYYY/MM/DD",
        showCloseBtn: true,
        showTodayBtn: true,
        // showEmptyBtn: true,
        persianDigits: false,
      });

      // Add native listener for start day
      const startInput = document.getElementById("start-day");
      const endInput = document.getElementById("end-day");

      const handleStart = (e) => {
        setStartDay(e.target.value);
      };

      const handleEnd = (e) => {
        setEndDay(e.target.value);
      };

      startInput?.addEventListener("change", handleStart);
      endInput?.addEventListener("change", handleEnd);

      // Cleanup
      return () => {
        startInput?.removeEventListener("change", handleStart);
        endInput?.removeEventListener("change", handleEnd);
      };
    }
  }, []);

  return (
    <div style={{ maxWidth: "800px" }}>
      {notice && (
        <Notice
          status={notice.status}
          isDismissible
          onRemove={() => setNotice(null)}
        >
          {notice.message}
        </Notice>
      )}

      <TextControl
        label={__("Schedule Name", "appointment-booking")}
        value={name}
        onChange={setName}
        placeholder={__(
          "Enter a name for this schedule",
          "appointment-booking"
        )}
      />

      <ToggleControl
        label={__("Is Active?", "appointment-booking")}
        checked={isActive}
        onChange={setIsActive}
      />

      <div className="components-base-control">
        <label htmlFor="start-day" className="components-base-control__label">
          {__("Start Day", "appointment-booking")}
        </label>
        <input
          id="start-day"
          className="components-base-control__input"
          type="text"
          data-jdp
          value={startDay}
          // onChange={(e) => handleStartDayChange(e.target.value)}
        />
      </div>

      <div className="components-base-control">
        <label htmlFor="end-day" className="components-base-control__label">
          {__("End Day", "appointment-booking")}
        </label>
        <input
          id="end-day"
          className="components-base-control__input"
          type="text"
          data-jdp
          value={endDay}
          // onChange={(e) => handleEndDayChange(e.target.value)}
        />
      </div>

      <TextControl
        label={__("Meeting Duration (mins)", "appointment-booking")}
        type="number"
        value={meetingDuration}
        onChange={(val) => setMeetingDuration(parseInt(val, 10))}
      />

      {/* <TextControl
        label={__("Start Day", "appointment-booking")}
        type="text"
        value={startDay}
        onChange={setStartDay}
      />

      <TextControl
        label={__("End Day", "appointment-booking")}
        type="text"
        value={endDay}
        onChange={setEndDay}
      /> */}

      {/* <TextControl
        label={__("Buffer Between Meetings (mins)", "appointment-booking")}
        type="number"
        value={buffer}
        onChange={(val) => setBuffer(parseInt(val, 10))}
      /> */}

      <SelectControl
        label={__("Select Admin", "appointment-booking")}
        value={selectedAdmin}
        options={adminUsers}
        onChange={setSelectedAdmin}
      />

      <WeeklyHoursEditor
        weekdays={weekdays}
        weeklyHours={weeklyHours}
        setWeeklyHours={setWeeklyHours}
      />

      <Button isPrimary onClick={handleSubmit} style={{ marginTop: "20px" }}>
        {__("Save Settings", "appointment-booking")}
      </Button>
    </div>
  );
}

export { CreateSchedule };
