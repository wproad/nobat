import {
  PanelBody,
  PanelRow,
  Button,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { weekdayLabels } from "../../../lib/constants";

export function WorkingHoursForDay({ day, hours, onAdd, onRemove, onUpdate }) {
  const hasHours = hours && hours.length > 0 && hours[0] !== "09:00-12:00";
  
  // Parse time range "09:00-12:00" to {start: "09:00", end: "12:00"}
  const parseTimeRange = (range) => {
    const [start, end] = range.split('-').map(t => t.trim());
    return { start: start || "09:00", end: end || "12:00" };
  };

  // Format time range back to "09:00-12:00"
  const formatTimeRange = (start, end) => {
    return `${start}-${end}`;
  };

  const handleTimeChange = (index, field, value) => {
    const { start, end } = parseTimeRange(hours[index]);
    const newStart = field === 'start' ? value : start;
    const newEnd = field === 'end' ? value : end;
    onUpdate(day, index, formatTimeRange(newStart, newEnd));
  };

  return (
    <PanelBody
      title={
        <div className="day-panel-title">
          <span className="day-name">{__(weekdayLabels[day].label, "nobat")}</span>
          {hasHours && (
            <span className="hours-count-chip">
              {hours.length} {hours.length === 1 ? __("slot", "nobat") : __("slots", "nobat")}
            </span>
          )}
        </div>
      }
      initialOpen={false}
    >
      <div className="working-hours-list">
        {hours.map((slot, index) => {
          const { start, end } = parseTimeRange(slot);
          return (
            <div
              key={index}
              className="working-hour-row"
            >
              <div className="time-picker-group">
                <div className="time-picker-field">
                  <label className="time-label">{__("Start", "nobat")}</label>
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                    className="time-input"
                    step="900"
                    pattern="[0-9]{2}:[0-9]{2}"
                  />
                </div>
                
                <span className="time-separator">—</span>
                
                <div className="time-picker-field">
                  <label className="time-label">{__("End", "nobat")}</label>
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                    className="time-input"
                    step="900"
                    pattern="[0-9]{2}:[0-9]{2}"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => onRemove(day, index)}
                className="remove-hour-icon-button"
                title={__("Remove time slot", "nobat")}
                type="button"
              >
                <span className="dashicons dashicons-minus"></span>
              </button>
            </div>
          );
        })}
        
        <div className="add-hour-section">
          <Button 
            variant="secondary"
            onClick={() => onAdd(day)}
            className="add-hour-button"
          >
            <span className="button-icon">➕</span>
            {__("Add Time Slot", "nobat")}
          </Button>
        </div>
      </div>
    </PanelBody>
  );
}
