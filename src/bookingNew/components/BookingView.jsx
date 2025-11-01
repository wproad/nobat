/**
 * BookingView Component
 *
 * Parent component that handles schedule fetching, loading, and error states.
 * Renders the BookingForm child component with schedule data.
 */
import { Card, CardBody, CardHeader } from "../../ui";
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

  return (
    <div className="appointment-booking-form">
      <Card>
        <CardHeader>
          <h3>{__("Book an Appointment", "nobat")}</h3>
        </CardHeader>
        <CardBody>{renderCardBody()}</CardBody>
      </Card>
    </div>
  );
};

export default BookingView;
