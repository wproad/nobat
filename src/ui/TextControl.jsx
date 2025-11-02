export function TextControl({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  help,
  disabled,
  className,
  min,
  max,
  step,
  ...props
}) {
  return (
    <div className={`nobat-text-control ${className || ''}`}>
      {label && (
        <label className="nobat-text-control__label">
          {label}
        </label>
      )}
      <input
        type={type}
        className="nobat-text-control__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        {...props}
      />
      {help && (
        <p className="nobat-text-control__help">
          {help}
        </p>
      )}
    </div>
  );
}

