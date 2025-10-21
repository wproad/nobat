import { useState } from "@wordpress/element";
import {
  TextControl,
  ToggleControl,
  Button,
  SelectControl,
  Notice,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { defaultWeeklyHours, weekdayLabels } from "../../../lib/constants";
import { WeeklyHoursEditor } from "./WeeklyHoursEditor";
import { JalaliDatePickerInput } from "./JalaliDatePicker";
import { useSchedule } from "../../../hooks/useSchedule";

function CreateSchedule() {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(defaultWeeklyHours);

  const { adminUsers, notice, setNotice, saveSchedule } = useSchedule();
  const buffer = 0;

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
    saveSchedule(payload)
      .then(() => {
        // TODO: send success message as well
        // Redirect to all schedules page after successful creation
        window.location.href =
          "/wp-admin/admin.php?page=appointment-booking-all-schedules&message=1";
      })
      .catch(() => {
        // Error handling is already done in the saveSchedule function
      });
  };

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

      <JalaliDatePickerInput
        id="start-day"
        label={__("Start Day", "appointment-booking")}
        value={startDay}
        onChange={setStartDay}
      />

      <JalaliDatePickerInput
        id="end-day"
        label={__("End Day", "appointment-booking")}
        value={endDay}
        onChange={setEndDay}
      />

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
        weekdays={Object.keys(weekdayLabels)}
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
