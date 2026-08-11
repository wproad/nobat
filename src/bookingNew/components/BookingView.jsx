/**
 * BookingView Component
 *
 * Parent component that handles schedule fetching with smart endpoint selection.
 * Supports both active schedule and specific schedule ID scenarios.
 * Manages loading states with Spinner, error handling, and data extraction.
 * Renders BookingForm with validated schedule data.
 *
 * @param {string} scheduleId - Optional schedule ID, uses active schedule if not provided
 */
import BookingForm from "./BookingForm";
import { __ } from "../../utils/i18n";
import { useGet } from "../hooks/useFetch";
import { Spinner } from "../../ui";

const BookingView = ({ scheduleId }) => {
  const endpoint = scheduleId
    ? `/nobat/v2/schedules/${scheduleId}`
    : "/nobat/v2/schedules/active";

  const {
    data: scheduleData,
    loading: scheduleLoading,
    error: scheduleError,
  } = useGet(endpoint);

  const schedule = scheduleData?.schedule || scheduleData || null;

  if (scheduleLoading) {
    return (
      <div className="bf-loading">
        <Spinner />
        <span>{__("Loading schedule...", "nobat")}</span>
      </div>
    );
  }

  if (scheduleError || !schedule) {
    return (
      <p className="bf-empty__muted">
        {scheduleError ||
          __(
            "No active schedule found. Please contact the administrator.",
            "nobat"
          )}
      </p>
    );
  }

  return <BookingForm schedule={schedule} />;
};

export default BookingView;
