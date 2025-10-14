import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";

export function useSchedule() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    apiFetch({ path: "/wp/v2/users?roles=administrator" })
      .then((users) => {
        setAdminUsers(users.map((u) => ({ label: u.name, value: u.id })));
      })
      .catch(() =>
        setNotice({
          status: "error",
          message: __("Error fetching users."),
        })
      );
  }, []);

  const saveSchedule = (payload) => {
    return apiFetch({
      path: "appointment-booking/v1/schedule",
      method: "POST",
      data: payload,
    })
      .then((response) => {
        // console.log("Schedule save response:", response);
        setNotice({
          status: "success",
          message: __("Settings saved successfully!"),
        });
        return response;
      })
      .catch((error) => {
        console.error("Schedule save error:", error);
        let errorMessage = __("Error saving settings.");

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

  return { adminUsers, notice, setNotice, saveSchedule };
}
