import { useState, useEffect, useCallback } from "@wordpress/element";

/**
 * Custom hook for fetching and managing active schedule data
 * @returns {Object} - { schedule, loading, error, refetch }
 */
export const useActiveSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("🔄 useActiveSchedule - Current state:", {
    hasSchedule: !!schedule,
    loading,
    error,
  });

  const fetchActiveSchedule = useCallback(async () => {
    console.log("📡 Starting to fetch active schedule...");
    console.log(
      "📍 API URL:",
      `/wp-json/appointment-booking/v1/schedule/active`
    );

    try {
      console.log("⏳ Setting loading to true");
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/wp-json/appointment-booking/v1/schedule/active`
      );

      console.log("📥 Response received");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log("   OK:", response.ok);

      if (!response.ok) {
        console.log("❌ Response not OK");
        if (response.status === 404) {
          console.log("   404 - No active schedule found");
          throw new Error(
            "No active schedule found. Please contact the administrator."
          );
        }
        const errorData = await response.json().catch(() => ({}));
        console.log("   Error data:", errorData);
        throw new Error(errorData.message || "Failed to fetch active schedule");
      }

      const data = await response.json();
      console.log("✅ Successfully fetched schedule data:");
      console.log("   Data:", data);
      console.log("   Weekly hours:", data.weekly_hours);

      console.log("💾 Setting schedule state");
      setSchedule(data);
      console.log("✓ Schedule state set");
    } catch (err) {
      console.log("🔴 Error caught in fetchActiveSchedule");
      console.error("   Error object:", err);
      console.error("   Error message:", err.message);

      const errorMessage = err.message || "Failed to load schedule";
      console.log("💾 Setting error state:", errorMessage);
      setError(errorMessage);
      setSchedule(null);
    } finally {
      console.log("🏁 Finally block - setting loading to false");
      setLoading(false);
      console.log("✓ Loading set to false");
    }
  }, []);

  useEffect(() => {
    console.log("🎯 useEffect triggered - calling fetchActiveSchedule");
    fetchActiveSchedule();

    return () => {
      console.log("🧹 useEffect cleanup");
    };
  }, []);

  console.log("↩️ Returning from useActiveSchedule:", {
    schedule,
    loading,
    error,
  });

  return {
    schedule,
    loading,
    error,
    refetch: fetchActiveSchedule,
  };
};
