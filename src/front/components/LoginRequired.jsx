import { __ } from "../../utils/i18n";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Notice,
} from "../../components/ui";

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
