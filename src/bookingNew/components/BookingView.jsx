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
  // Determine which endpoint to use based on scheduleId prop
  const endpoint = scheduleId
    ? `/nobat/v2/schedules/${scheduleId}`
    : "/nobat/v2/schedules/active";

  // Fetch schedule using useGet
  const {
    data: scheduleData,
    loading: scheduleLoading,
    error: scheduleError,
  } = useGet(endpoint);

  // Extract schedule from API response
  const schedule = scheduleData?.schedule || scheduleData || null;

  // Determine card body content based on state
  const renderCardBody = () => {
    // Show loading state
    if (scheduleLoading) {
      return (
        <>
          <Spinner />
          <p>{__("Loading schedule...", "nobat")}</p>
        </>
      );
    }

    // Show error state
    if (scheduleError || !schedule) {
      return (
        <p className="error">
          {scheduleError ||
            __(
              "No active schedule found. Please contact the administrator.",
              "nobat"
            )}
        </p>
      );
    }

    // Show booking form
    return <BookingForm schedule={schedule} />;
  };

  return <div className="appointment-booking-form">{renderCardBody()}</div>;
};

export default BookingView;
