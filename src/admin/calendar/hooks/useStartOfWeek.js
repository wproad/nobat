import { useEffect, useState } from "@wordpress/element";

export const useStartOfWeek = () => {
  const [startOfWeekIndex, setStartOfWeekIndex] = useState(6);

  useEffect(() => {
    const fetchStartOfWeek = async () => {
      try {
        const response = await fetch("/wp-json/wp/v2/settings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch WP settings");
        const settings = await response.json();
        if (
          settings &&
          typeof settings.start_of_week === "number" &&
          settings.start_of_week >= 0 &&
          settings.start_of_week <= 6
        ) {
          setStartOfWeekIndex(settings.start_of_week);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Using default start of week (Saturday):", e?.message);
      }
    };
    fetchStartOfWeek();
  }, []);

  return { startOfWeekIndex };
};
