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
      path: "appointment-booking/v1/create-schedule",
      method: "POST",
      data: payload,
    })
      .then(() =>
        setNotice({
          status: "success",
          message: __("Settings saved successfully!"),
        })
      )
      .catch(() =>
        setNotice({
          status: "error",
          message: __("Error saving settings."),
        })
      );
  };

  return { adminUsers, notice, setNotice, saveSchedule };
}
