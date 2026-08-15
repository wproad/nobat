/**
 * AppointmentTicket Component
 *
 * Soft Slot success ticket after booking (matches booking-success design).
 *
 * @param {Object} appointment - Appointment object containing id, dates, times, note, status, and user_name
 * @param {Function} [onBack] - Optional callback for the back / list navigation button
 * @param {string} [backLabel] - Optional label for the back button
 */
import {
  getStatusClass,
  getStatusText,
  formatTimeRange,
  getUserDisplayName,
} from "../utils/displayHelpers";
import { __ } from "../../utils/i18n";

/**
 * Build footer REF from jalali date + appointment number, e.g. REF-14050517-0006
 * @param {string} jalaliDate
 * @param {number|string} appointmentId
 * @returns {string}
 */
const buildRefCode = (jalaliDate, appointmentId) => {
  const datePart = String(jalaliDate || "").replace(/\D/g, "");
  const idPart = String(appointmentId ?? "").padStart(4, "0");
  return `REF-${datePart}-${idPart}`;
};

const AppointmentTicket = ({ appointment, onBack, backLabel }) => {
  if (!appointment) {
    return null;
  }

  const {
    id,
    slot_date_jalali,
    start_time,
    end_time,
    status,
    slot_date,
    note,
  } = appointment;

  const displayDate = slot_date_jalali || slot_date;
  const dateTimeLabel = `${displayDate} · ${formatTimeRange(start_time, end_time)}`;
  const refCode = buildRefCode(displayDate, id);
  const noteText = typeof note === "string" ? note.trim() : "";
  const hasNote = Boolean(noteText);
  const currentUser =
    typeof window !== "undefined" ? window.wpApiSettings?.currentUser : null;
  const userName =
    getUserDisplayName(appointment) || getUserDisplayName(currentUser);

  const reservationMessage =
    typeof window !== "undefined" && window.wpApiSettings?.reservationMessage;
  const defaultSubtitle = __(
    "کارشناسان ما در اولین فرصت با شما تماس خواهند گرفت.",
    "nobat"
  );
  const navLabel = backLabel || __("مشاهده نوبت‌های من", "nobat");

  return (
    <div className="bf-success-page">
      {typeof onBack === "function" && (
        <div className="bf-success-page__nav">
          <button
            type="button"
            className="bf-btn bf-btn--ghost"
            onClick={onBack}
          >
            {navLabel}
          </button>
        </div>
      )}

      <article
        className={`bf-ticket${hasNote ? " bf-ticket--has-note" : ""}`}
        aria-labelledby="ticket-title"
      >
        <header className="bf-ticket__hero">
          <div className="bf-ticket__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="bf-ticket__title" id="ticket-title">
            {__("رزرو با موفقیت انجام شد", "nobat")}
          </h1>
          {reservationMessage ? (
            <p
              className="bf-ticket__subtitle"
              dangerouslySetInnerHTML={{ __html: reservationMessage }}
            />
          ) : (
            <p className="bf-ticket__subtitle">{defaultSubtitle}</p>
          )}
        </header>

        <div className="bf-ticket__tear" aria-hidden="true">
          <span className="bf-ticket__notch bf-ticket__notch--start" />
          <span className="bf-ticket__tear-line" />
          <span className="bf-ticket__notch bf-ticket__notch--end" />
        </div>

        <div className="bf-ticket__body">
          <dl className="bf-ticket__grid">
            <div className="bf-ticket__field">
              <dt className="bf-ticket__label">
                {__("شماره نوبت", "nobat")}
              </dt>
              <dd className="bf-ticket__value">#{id}</dd>
            </div>
            <div className="bf-ticket__field bf-ticket__field--end">
              <dt className="bf-ticket__label">{__("وضعیت", "nobat")}</dt>
              <dd>
                <span className={`bf-badge ${getStatusClass(status)}`}>
                  {getStatusText(status)}
                </span>
              </dd>
            </div>
            {userName && (
              <div className="bf-ticket__field bf-ticket__field--full">
                <dt className="bf-ticket__label">{__("نام", "nobat")}</dt>
                <dd className="bf-ticket__value">{userName}</dd>
              </div>
            )}
            <div className="bf-ticket__field bf-ticket__field--full">
              <dt className="bf-ticket__label">
                {__("تاریخ و زمان", "nobat")}
              </dt>
              <dd className="bf-ticket__value">{dateTimeLabel}</dd>
            </div>
          </dl>

          {hasNote && (
            <div className="bf-ticket__note">
              <p className="bf-ticket__note-label">{__("یادداشت", "nobat")}</p>
              <p className="bf-ticket__note-text">{noteText}</p>
            </div>
          )}
        </div>

        <div className="bf-ticket__perforation" aria-hidden="true" />

        <footer className="bf-ticket__footer">
          <p className="bf-ticket__code">{refCode}</p>
        </footer>
      </article>
    </div>
  );
};

export default AppointmentTicket;
