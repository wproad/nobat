import { useState } from "react";
import {
  TextControl,
  ToggleControl,
  Button,
  Notice,
} from "../../../components/ui";
import { __ } from "../../../utils/i18n";
import { defaultWeeklyHours, weekdayLabels } from "../../../lib/constants";
import { WeeklyHoursEditor } from "./WeeklyHoursEditor";
import { JalaliDatePickerInput } from "./JalaliDatePicker";
import { useSchedule } from "../../../hooks/useSchedule";
import { jalaliToGregorian } from "../../../lib/dateConverter";

function CreateSchedule() {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [weeklyHours, setWeeklyHours] = useState(defaultWeeklyHours);

  const { notice, setNotice, saveSchedule } = useSchedule();
  const buffer = 0;

  const handleSubmit = () => {
    // Convert Jalali dates to Gregorian before sending to API
    const startDate = jalaliToGregorian(startDay);
    const endDate = jalaliToGregorian(endDay);
    
    if (!startDate || !endDate) {
      setNotice({
        status: "error",
        message: __("Invalid date format. Please check your dates.", "nobat"),
      });
      return;
    }
    
    const payload = {
      name,
      isActive,
      startDate,  // Gregorian format YYYY-MM-DD
      endDate,    // Gregorian format YYYY-MM-DD
      meetingDuration,
      buffer,
      weeklyHours,
    };
    
    saveSchedule(payload)
      .then(() => {
        // Redirect to all schedules page after successful creation
        window.location.href =
          "/wp-admin/admin.php?page=nobat-schedules&message=1";
      })
      .catch(() => {
        // Error handling is already done in the saveSchedule function
      });
  };

  return (
    <div className="create-schedule-container">
      <div className="schedule-header">
        <h1 className="schedule-title">
          📅 {__("Create New Schedule", "nobat")}
        </h1>
        <p className="schedule-subtitle">
          {__("Set up your availability schedule with working hours and time slots", "nobat")}
        </p>
      </div>

      {notice && (
        <Notice
          status={notice.status}
          isDismissible
          onRemove={() => setNotice(null)}
        >
          {notice.message}
        </Notice>
      )}

      {/* Basic Information Section */}
      <div className="schedule-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">ℹ️</span>
            {__("Basic Information", "nobat")}
          </h2>
          <p className="section-description">
            {__("Give your schedule a name and set its status", "nobat")}
          </p>
        </div>

        <div className="section-content">
          <div className="form-row">
            <div className="form-field full-width">
              <TextControl
                label={__("Schedule Name", "nobat")}
                value={name}
                onChange={setName}
                placeholder={__("e.g., Summer 2024 Schedule", "nobat")}
                help={__("A descriptive name to identify this schedule", "nobat")}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <ToggleControl
                label={__("Activate Schedule", "nobat")}
                checked={isActive}
                onChange={setIsActive}
                help={isActive 
                  ? __("This schedule is active and visible to users", "nobat")
                  : __("This schedule is inactive and hidden from users", "nobat")
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Period Section */}
      <div className="schedule-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">📆</span>
            {__("Schedule Period", "nobat")}
          </h2>
          <p className="section-description">
            {__("Define the date range when this schedule is valid", "nobat")}
          </p>
        </div>

        <div className="section-content">
          <div className="form-row two-columns">
            <div className="form-field">
              <JalaliDatePickerInput
                id="start-day"
                label={__("Start Date", "nobat")}
                value={startDay}
                onChange={setStartDay}
              />
            </div>

            <div className="form-field">
              <JalaliDatePickerInput
                id="end-day"
                label={__("End Date", "nobat")}
                value={endDay}
                onChange={setEndDay}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Settings Section */}
      <div className="schedule-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">⏱️</span>
            {__("Appointment Settings", "nobat")}
          </h2>
          <p className="section-description">
            {__("Configure the duration of each appointment slot", "nobat")}
          </p>
        </div>

        <div className="section-content">
          <div className="form-row">
            <div className="form-field">
              <TextControl
                label={__("Appointment Duration (minutes)", "nobat")}
                type="number"
                value={meetingDuration}
                onChange={(val) => setMeetingDuration(parseInt(val, 10))}
                min="15"
                step="15"
                help={__("How long each appointment will last", "nobat")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Hours Section */}
      <div className="schedule-section weekly-hours-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🕐</span>
            {__("Weekly Working Hours", "nobat")}
          </h2>
          <p className="section-description">
            {__("Define your available hours for each day of the week", "nobat")}
          </p>
        </div>

        <div className="section-content">
          <WeeklyHoursEditor
            weekdays={Object.keys(weekdayLabels)}
            weeklyHours={weeklyHours}
            setWeeklyHours={setWeeklyHours}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="schedule-actions">
        <Button 
          variant="secondary"
          href="/wp-admin/admin.php?page=nobat-schedules"
        >
          {__("Cancel", "nobat")}
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!name || !startDay || !endDay}
        >
          <span className="button-icon">💾</span>
          {__("Create Schedule", "nobat")}
        </Button>
      </div>
    </div>
  );
}

export { CreateSchedule };
