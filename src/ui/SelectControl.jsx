export function SelectControl({
  label,
  value,
  options = [],
  onChange,
  help,
  disabled,
  className,
  ...props
}) {
  return (
    <div className={`nobat-select-control ${className || ''}`}>
      {label && (
        <label className="nobat-select-control__label">
          {label}
        </label>
      )}
      <select
        className="nobat-select-control__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {help && (
        <p className="nobat-select-control__help">
          {help}
        </p>
      )}
    </div>
  );
}

