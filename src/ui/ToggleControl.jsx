export function ToggleControl({
  label,
  checked,
  onChange,
  help,
  disabled,
  className,
  ...props
}) {
  return (
    <div className={`nobat-toggle-control ${className || ''}`}>
      <div className="nobat-toggle-control__wrapper">
        <label className="nobat-toggle-control__label">
          <input
            type="checkbox"
            className="nobat-toggle-control__input"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            {...props}
          />
          <span className="nobat-toggle-control__track">
            <span className="nobat-toggle-control__thumb" />
          </span>
          <span className="nobat-toggle-control__text">{label}</span>
        </label>
      </div>
      {help && (
        <p className="nobat-toggle-control__help">
          {help}
        </p>
      )}
    </div>
  );
}

