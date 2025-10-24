import { useState } from "react";
import apiFetch from "../utils/api-fetch";
import { __ } from "../utils/i18n";

export function useSchedule() {
  const [notice, setNotice] = useState(null);

  const saveSchedule = (payload) => {
    return apiFetch({
      path: "nobat/v2/schedules",
      method: "POST",
      data: payload,
    })
      .then((response) => {
        // console.log("Schedule save response:", response);
        setNotice({
          status: "success",
          message: __("Settings saved successfully!", "nobat"),
        });
        return response;
      })
      .catch((error) => {
        console.error("Schedule save error:", error);
        let errorMessage = __("Error saving settings.", "nobat");

        if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.data && error.data.message) {
          errorMessage = error.data.message;
        }

        setNotice({
          status: "error",
          message: errorMessage,
        });
        throw error;
      });
  };

  return { notice, setNotice, saveSchedule };
}
