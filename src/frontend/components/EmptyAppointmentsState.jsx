/**
 * EmptyAppointmentsState Component
 *
 * Soft Slot empty state when the user has no appointments yet.
 */
import { __ } from "../../utils/i18n";

const EmptyAppointmentsState = () => {
  return (
    <div className="bf-empty">
      <h3 className="bf-empty__title">
        {__("You don't have any appointments yet", "nobat")}
      </h3>
      <p className="bf-empty__desc">
        {__(
          "It's time to book your first appointment! Contact us and benefit from our quality services.",
          "nobat"
        )}
      </p>
    </div>
  );
};

export default EmptyAppointmentsState;
