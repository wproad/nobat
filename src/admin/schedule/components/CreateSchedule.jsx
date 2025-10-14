import { useState } from "@wordpress/element";
import {
  TextControl,
  ToggleControl,
  Button,
  SelectControl,
  Notice,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { defaultWeeklyHours, weekdays } from "../constants";
import { WeeklyHoursEditor } from "./WeeklyHoursEditor";
import { useSchedule } from "../hooks/useSchedule";

function CreateSchedule() {
  // TODO: remove in prod
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDay, setStartDay] = useState(today);
  const [endDay, setEndDay] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(60);
  const [buffer, setBuffer] = useState(0);
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
        label={__("Schedule Name")}
        value={name}
        onChange={setName}
        placeholder={__("Enter a name for this schedule")}
      />

      <ToggleControl
        label={__("Is Active?")}
        checked={isActive}
        onChange={setIsActive}
      />

      <TextControl
        label={__("Start Day")}
        type="date"
        value={startDay}
        onChange={setStartDay}
      />

      <TextControl
        label={__("End Day")}
        type="date"
        value={endDay}
        onChange={setEndDay}
      />

      <TextControl
        label={__("Meeting Duration (mins)")}
        type="number"
        value={meetingDuration}
        onChange={(val) => setMeetingDuration(parseInt(val, 10))}
      />

      <TextControl
        label={__("Buffer Between Meetings (mins)")}
        type="number"
        value={buffer}
        onChange={(val) => setBuffer(parseInt(val, 10))}
      />

      <SelectControl
        label={__("Select Admin")}
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
        {__("Save Settings")}
      </Button>
    </div>
  );
}

export { CreateSchedule };
