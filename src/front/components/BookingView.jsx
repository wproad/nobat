/**
 * BookingView Component
 *
 * Parent component that handles schedule fetching, loading, and error states.
 * Renders the BookingForm child component with schedule data.
 */
import { useMemo } from "react";
import { Card, CardBody } from "../../components/ui";
import BookingForm from "./BookingForm";
import { __ } from "../../utils/i18n";
import { useGet } from "../hooks/useFetch";

const BookingView = () => {
  // Fetch active schedule using useGet
  const {
    data: scheduleData,
    loading: scheduleLoading,
    error: scheduleError,
  } = useGet("/nobat/v2/schedules/active");

  // Extract schedule from API response
  const schedule = scheduleData?.schedule || scheduleData || null;

  // Show loading state
  if (scheduleLoading) {
    return (
      <div className="appointment-booking-form">
        <Card>
          <CardBody>
            <p>{__("Loading schedule...", "nobat")}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Show error state
  if (scheduleError || !schedule) {
    return (
      <div className="appointment-booking-form">
        <Card>
          <CardBody>
            <p className="error">
              {scheduleError ||
                __(
                  "No active schedule found. Please contact the administrator.",
                  "nobat"
                )}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <BookingForm schedule={schedule} />;
};

export default BookingView;
