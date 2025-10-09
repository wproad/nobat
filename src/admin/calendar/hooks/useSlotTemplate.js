import { useEffect, useState } from "@wordpress/element";

export const useSlotTemplate = () => {
  const [slotTemplate, setSlotTemplate] = useState([]);
  const [slotsError, setSlotsError] = useState(null);

  useEffect(() => {
    const fetchSlotTemplate = async () => {
      try {
        setSlotsError(null);
        const response = await fetch(
          "/wp-json/appointment-booking/v1/time-slots-template",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-WP-Nonce": wpApiSettings.nonce,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch time slots template");
        }
        const data = await response.json();
        const normalized = Array.isArray(data)
          ? data.map((item) =>
              typeof item === "string" ? { label: item, excluded: false } : item
            )
          : [];
        setSlotTemplate(normalized);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setSlotsError(e.message);
        setSlotTemplate(
          [
            "9:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
            "14:00-15:00",
            "15:00-16:00",
            "16:00-17:00",
          ].map((s) => ({ label: s, excluded: false }))
        );
      }
    };
    fetchSlotTemplate();
  }, []);

  return { slotTemplate, slotsError };
};
