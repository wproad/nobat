import { PanelBody, PanelRow, Button, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export function WorkingHoursForDay({ day, hours, onAdd, onRemove, onUpdate }) {
  return (
    <PanelBody title={day.toUpperCase()} initialOpen={true}>
      {hours.map((slot, index) => (
        <PanelRow
          key={index}
          style={{ display: "flex", gap: "10px", marginBottom: "5px" }}
        >
          <TextControl
            value={slot}
            onChange={(val) => onUpdate(day, index, val)}
            placeholder="e.g. 9:00-12:00"
          />
          <Button isDestructive onClick={() => onRemove(day, index)}>
            {__("Remove")}
          </Button>
        </PanelRow>
      ))}
      <Button isPrimary onClick={() => onAdd(day)}>
        {__("Add Working Hour")}
      </Button>
    </PanelBody>
  );
}
