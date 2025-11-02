/**
 * LoginRequired Component
 *
 * Displays a authentication gate UI for unauthenticated users.
 * Shows a warning notice explaining the requirement to be logged in.
 * Provides login and registration button links with proper styling.
 * Used as a fallback in Main component when user is not authenticated.
 *
 * @param {string} loginUrl - URL to the login page
 * @param {string} registerUrl - URL to the registration page
 */
import { __ } from "../../utils/i18n";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Notice,
} from "../../ui";

const LoginRequired = ({ loginUrl, registerUrl }) => {
  return (
    <div className="main-container">
      <div className="auth-prompt">
        <Card>
          <CardHeader>
            <h3>{__("Access Required", "nobat")}</h3>
          </CardHeader>
          <CardBody>
            <Notice status="warning" isDismissible={false}>
              <p>
                {__("You must be logged in to view appointments.", "nobat")}
              </p>
            </Notice>
            <div className="form-actions" style={{ marginTop: "16px" }}>
              <Button variant="primary" href={loginUrl}>
                {__("Log In", "nobat")}
              </Button>
              <Button
                variant="secondary"
                href={registerUrl}
                style={{ marginLeft: "8px" }}
              >
                {__("Register", "nobat")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginRequired;
