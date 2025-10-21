import {
  PanelBody,
  PanelRow,
  Button,
  TextControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { weekdayLabels } from "../../../lib/constants";

export function WorkingHoursForDay({ day, hours, onAdd, onRemove, onUpdate }) {
  return (
    <PanelBody
      title={__(weekdayLabels[day].label, "appointment-booking")}
      initialOpen={true}
    >
      {hours.map((slot, index) => (
        <PanelRow
          key={index}
          style={{ display: "flex", gap: "10px", marginBottom: "5px" }}
        >
          <TextControl
            value={slot}
            onChange={(val) => onUpdate(day, index, val)}
            placeholder={__("e.g. 9:00-12:00", "appointment-booking")}
          />
          <Button isDestructive onClick={() => onRemove(day, index)}>
            {__("Remove", "appointment-booking")}
          </Button>
        </PanelRow>
      ))}
      <Button isPrimary onClick={() => onAdd(day)}>
        {__("Add Working Hour", "appointment-booking")}
      </Button>
    </PanelBody>
  );
}
