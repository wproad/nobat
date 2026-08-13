/**
 * LoginRequired Component
 *
 * Soft Slot auth gate for unauthenticated users.
 *
 * @param {string} loginUrl - URL to the login page
 * @param {string} registerUrl - URL to the registration page
 */
import { __ } from "../../utils/i18n";
import { Notice } from "../../ui";

const LoginRequired = ({ loginUrl, registerUrl }) => {
  return (
    <div className="bf-shell">
      <header className="bf-header">
        <h1 className="bf-title">{__("Access Required", "nobat")}</h1>
      </header>
      <div className="bf-card bf-auth">
        <Notice status="warning" isDismissible={false}>
          {__("You must be logged in to view appointments.", "nobat")}
        </Notice>
        <div className="bf-auth__actions">
          <a className="bf-btn bf-btn--primary" href={loginUrl}>
            {__("Log In", "nobat")}
          </a>
          <a className="bf-btn bf-btn--ghost" href={registerUrl}>
            {__("Register", "nobat")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;
